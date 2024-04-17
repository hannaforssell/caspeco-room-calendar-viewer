import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_APP_CLIENT_ID as string,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_APP_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {	
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
                if (containsPii) {
                    return;
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["User.Read", "Calendars.ReadBasic"]
};
