export const NetworkService = {
    async fetchWithTimeout(url, options = {}, timeout = 7000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    },

    handleNetworkError(error, context) {
        console.error(`${context} Error:`, error);

        if (error.name === 'AbortError') {
            return "Request timed out. Please check your connection.";
        } else if (error.message.includes('Failed to fetch')) {
            return "Network error. Please check your internet connection.";
        } else {
            return `${context} failed: ${error.message}`;
        }
    }
};

export const TokenService = {
    setToken(token) {
        // For browser environments, use secure storage
        try {
            // Fallback to more secure storage methods
            if (window.localStorage) {
                localStorage.setItem('authToken', token);
            }
        } catch (error) {
            console.error('Token storage failed', error);
        }
    },

    getToken() {
        return localStorage.getItem('authToken');
    },

    removeToken() {
        localStorage.removeItem('authToken');
    }
};

export const ValidationService = {
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePassword(password) {
        // At least 8 characters, one uppercase, one lowercase, one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }
};