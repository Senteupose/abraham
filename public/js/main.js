(async function () {
  const statsRoot = document.getElementById('live-stats');
  if (!statsRoot) return;

  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return;
    const data = await res.json();
    const boxes = statsRoot.querySelectorAll('div');
    if (boxes.length < 4) return;
    boxes[0].querySelector('strong').textContent = data.total_issues;
    boxes[1].querySelector('strong').textContent = data.resolved_issues;
    boxes[2].querySelector('strong').textContent = data.total_subscribers;
    boxes[3].querySelector('strong').textContent = data.total_updates;
  } catch (_err) {
    // Non-blocking enhancement only.
  }
})();
