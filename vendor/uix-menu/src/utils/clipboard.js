export function copyButtonValue(button) {
    const text = button?.dataset.copy;
    if (!button || !text || !navigator.clipboard?.writeText) {
        return Promise.resolve(false);
    }

    return navigator.clipboard.writeText(text).then(() => {
        const icon = button.querySelector('i');
        if (!icon) {
            return true;
        }

        icon.className = 'bi bi-check2';
        window.setTimeout(() => {
            icon.className = 'bi bi-copy';
        }, 1000);

        return true;
    });
}
