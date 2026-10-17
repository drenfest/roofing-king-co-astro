export function initBeforeAfter() {
  const comparisons = document.querySelectorAll('[data-rk-before-after]');

  comparisons.forEach((comparison) => {
    const range = comparison.querySelector('.rk-before-after-range');

    if (!range) {
      return;
    }

    const update = () => {
      comparison.style.setProperty('--rk-before-after-position', `${range.value}%`);
    };
    const setPositionFromPointer = (event) => {
      const rect = comparison.getBoundingClientRect();
      const nextValue = ((event.clientX - rect.left) / rect.width) * 100;
      range.value = String(Math.max(0, Math.min(100, Math.round(nextValue))));
      update();
    };
    let isDragging = false;

    range.addEventListener('input', update);
    range.addEventListener('change', update);
    comparison.addEventListener('pointerdown', (event) => {
      isDragging = true;
      comparison.setPointerCapture?.(event.pointerId);
      setPositionFromPointer(event);
    });
    comparison.addEventListener('pointermove', (event) => {
      if (!isDragging) {
        return;
      }

      setPositionFromPointer(event);
    });
    comparison.addEventListener('pointerup', () => {
      isDragging = false;
    });
    comparison.addEventListener('pointercancel', () => {
      isDragging = false;
    });
    comparison.addEventListener('lostpointercapture', () => {
      isDragging = false;
    });
    update();
  });
}
