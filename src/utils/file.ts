export const fileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove data:image/png;base64, prefix if backend expects raw base64
            // Flutter code: base64Encode(bytes) -> raw base64.
            // DataURL includes prefix. I need to strip it.
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
};

export const getBlobFromUrl = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    return response.blob();
}
