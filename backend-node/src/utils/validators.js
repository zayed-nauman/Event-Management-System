export const validateEventData = (data) => {
    const errors = {};
    
    if (!data.title || data.title.trim() === '') {
        errors.title = 'Event title is required';
    }
    
    if (!data.date) {
        errors.date = 'Event date is required';
    }
    
    if (!data.location || data.location.trim() === '') {
        errors.location = 'Event location is required';
    }
    
    if (data.capacity <= 0) {
        errors.capacity = 'Event capacity must be greater than zero';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateUserRegistration = (data) => {
    const errors = {};
    
    if (!data.username || data.username.trim() === '') {
        errors.username = 'Username is required';
    }
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Valid email is required';
    }
    
    if (!data.password || data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};