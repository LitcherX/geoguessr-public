export async function apiCall(endpoint, method, auth, body = null) {
    if (auth?.server) {
        try {
            const { headers } = auth;
            const response = await fetch(
                `${headers["x-forwarded-proto"]}://${headers["host"]}/api/${endpoint}`,
                {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: body ? JSON.stringify(body) : null,
                }
            );
            return await response.json();
        } catch (error) {
            return null;
        }
    } else {
        try {
            const response = await fetch(`/api/${endpoint}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify(body) : null,
            });
            return await response.json();
        } catch (error) {
            return null;
        }
    }
}
