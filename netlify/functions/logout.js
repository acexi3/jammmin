exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': [
          'spotify_access_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
          'spotify_refresh_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
        ]
      },
      body: JSON.stringify({ success: true, message: 'Logged out successfully' })
    };
  };