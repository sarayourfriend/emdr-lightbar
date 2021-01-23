export const useIsTherapist = () => {
    const url = new URL(window.location);
    return url.pathname.endsWith('therapist');
}
