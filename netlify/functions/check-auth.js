exports.handler = async (event, context) => {
    const accessToken = event.headers.cookie?.match(/spotify_access_token=([^;]+)/)?.[1];
    const refreshToken = event.headers.cookie?.match(/spotify_refresh_token=([^;]+)/)?.[1];
  
    return {
      statusCode: 200,
      body: JSON.stringify({ isAuthenticated: !!(accessToken && refreshToken) })
    };
  };