export const formatMatricula = (value: string): string => {
    // Remove non-digits
    let cleanInfo = value.replace(/\D/g, '');

    // Limit to 7 digits
    if (cleanInfo.length > 7) cleanInfo = cleanInfo.slice(0, 7);

    // Apply mask ###.###-#
    if (cleanInfo.length > 6) {
        return cleanInfo.replace(/^(\d{3})(\d{3})(\d{1})/, '$1.$2-$3');
    } else if (cleanInfo.length > 3) {
        return cleanInfo.replace(/^(\d{3})(\d+)/, '$1.$2');
    }

    return cleanInfo;
};

export const unmaskMatricula = (value: string): string => {
    return value.replace(/\D/g, '');
};

export const formatDateForInput = (date: string | Date): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    return d.toISOString().slice(0, 16);
};
