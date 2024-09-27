import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

// WebBrowser session handling for mobile
WebBrowser.maybeCompleteAuthSession();

// Twitter OAuth 2.0 endpoints
const discovery = {
  authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
  tokenEndpoint: 'https://api.x.com/2/oauth2/token',
  revocationEndpoint: 'https://twitter.com/i/oauth2/revoke',
};

// 创建一个函数，进行 Twitter OAuth 流程
export function handleTwitterOAuth() {
  // Generate the redirect URI using custom scheme
  const redirectUri = makeRedirectUri({
    scheme: 'myapp', // Custom scheme, ensure this matches your app config
    useProxy: false,
  });

  console.log('Redirect URI:', redirectUri);

  // Twitter OAuth request configuration
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'ZXFBLXNMSnVsRlRBdGxHVF95V2Q6MTpjaQ', // 你的 Twitter client ID
      redirectUri: redirectUri,
      scopes: ['tweet.read', 'users.read', 'follows.read', 'offline.access'], // OAuth scopes
      responseType: 'code',
      codeChallenge: 'challenge', // PKCE challenge
    },
    discovery // Endpoints
  );

  // Prompt the OAuth login (this can be called from other components)
  const initiateAuth = async () => {
    const result = await promptAsync({ useProxy: false }); // Start OAuth session

    if (result?.type === 'success') {
      const { code } = result.params;
      console.log('Authorization Code:', code);

      const tokenRequest = {
        code,
        redirect_uri: redirectUri,
        client_id: 'ZXFBLXNMSnVsRlRBdGxHVF95V2Q6MTpjaQ', // 你的 Twitter client ID
        grant_type: 'authorization_code',
        code_verifier: request.codeVerifier, // PKCE challenge
      };

      // 发送 token 请求
      return fetch('https://api.x.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenRequest).toString(),
      })
        .then((tokenResponse) => tokenResponse.json())
        .then((tokenData) => {
          console.log('Access Token:', tokenData);
          return tokenData;
        })
        .catch((error) => {
          console.error('Access Token Error:', error);
          throw error;
        });
    } else {
      console.log('OAuth Process Cancelled or Failed', result);
    }
  };

  return { initiateAuth, request }; // Return the initiate function and request object for external use
}
