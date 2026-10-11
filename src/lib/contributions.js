// Pulls a user's last-year contribution calendar from GitHub's public
// contributions page (no token needed) and boils it down to days, weeks
// and a few headline stats. Runs on the server; cached for six hours.

const parseCount = (label) => {
  const n = parseInt(label.trim().replace(/,/g, ""), 10);
  return Number.isNaN(n) ? 0 : n; // "No contributions on ..."
};

export async function getContributions(user) {
  let html;
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  // Each day is a <td data-date id> and its count lives in a <tool-tip for=id>.
  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts.set(m[1], parseCount(m[2]));
  }
  const days = [];
  for (const m of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
    const date = m[0].match(/data-date="([\d-]+)"/)?.[1];
    const id = m[0].match(/\bid="([^"]+)"/)?.[1];
    if (date) days.push({ date, count: counts.get(id) ?? 0 });
  }
  if (!days.length) return null;
  days.sort((a, b) => (a.date < b.date ? -1 : 1));

  // Calendar starts on a Sunday, so every 7 days is one week.
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    const slice = days.slice(i, i + 7);
    weeks.push({ start: slice[0].date, days: slice, total: slice.reduce((s, d) => s + d.count, 0) });
  }

  let total = 0;
  let activeDays = 0;
  let busiest = days[0];
  let run = 0;
  let longest = { length: 0, start: null, end: null };
  days.forEach((d, i) => {
    total += d.count;
    if (d.count > busiest.count) busiest = d;
    if (d.count > 0) {
      activeDays++;
      run++;
      if (run > longest.length) longest = { length: run, start: days[i - run + 1].date, end: d.date };
    } else run = 0;
  });

  // Current streak: today may not have a commit yet, so start from yesterday then.
  let current = 0;
  let i = days.length - 1;
  if (days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;

  return { user, days, weeks, total, activeDays, busiest, longest, current };
}
