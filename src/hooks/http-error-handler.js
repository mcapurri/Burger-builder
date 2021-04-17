import { useState, useEffect } from "react";

const useHttpErrorHandler = (httpClient) => {
    const [error, setError] = useState(null);

    const reqInterceptor = httpClient.interceptors.request.use((req) => {
        setError(null);
        return req;
    });
    const resInterceptor = httpClient.interceptors.response.use(
        (res) => res,
        (err) => {
            setError(err);
        }
    );

    // I clean up the interceptors when im not using them
    useEffect(() => {
        return () => {
            httpClient.interceptors.request.eject(reqInterceptor);
            httpClient.interceptors.response.eject(resInterceptor);
        };
    }, [reqInterceptor, resInterceptor, httpClient]);

    const errorConfirmedHandler = () => {
        setError(null);
    };
    return [error, errorConfirmedHandler];
};

export default useHttpErrorHandler;
