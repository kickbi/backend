import axios from "axios"
import { IGoogleOAuthTokenVerificationResponse, IGoogleUserInfo } from "../interface/auth.interface";
import * as RESPONSE_MESSAGES from "../messages/response.messages";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_OAUTH_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export const verifyGoogleOAuthToken = async (token: string) => {
    const oauthRequest = {
        url: new URL(GOOGLE_OAUTH_TOKEN_URL),
        params: {
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            code: token,
            grant_type: "authorization_code",
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        },
    };

    try {
        const response = await axios.post(oauthRequest.url.toString(), null, { params: oauthRequest.params });
        return response.data as IGoogleOAuthTokenVerificationResponse;
    } catch (error) {
        throw new Error(RESPONSE_MESSAGES.GOOGLE_OAUTH_TOKEN_VERIFICATION_FAILED);
    }
}


export const getGoogleUserInfo = async (accessToken: string) => {
    try {
        const response = await axios.get(GOOGLE_OAUTH_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data as IGoogleUserInfo;
    } catch (error) {
        throw new Error(RESPONSE_MESSAGES.GOOGLE_OAUTH_USERINFO_FETCH_FAILED);
    }
}