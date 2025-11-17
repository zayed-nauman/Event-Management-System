export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const calculateRemainingSpots = (totalSpots, registeredCount) => {
    return totalSpots - registeredCount;
};

export const isUserRegistered = (userId, registrations) => {
    return registrations.some(registration => registration.userId === userId);
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};