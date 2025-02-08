exports.handler = async (event, context) => {
  console.log('Logout function triggered');

  // Create cookie removal strings with matching domain and path
  const accessTokenRemoval = 'spotify_access_token=; Path=/; Domain=findyournextjam.netlify.app; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
  const refreshTokenRemoval = 'spotify_refresh_token=; Path=/; Domain=findyournextjam.netlify.app; HttpOnly; Secure; SameSite=Strict; Max-Age=0';

  return {
    statusCode: 200,
    multiValueHeaders: {
      'Set-Cookie': [
        accessTokenRemoval,
        refreshTokenRemoval
      ],
      'Cache-Control': ['no-cache, no-store, must-revalidate'],
      'Pragma': ['no-cache'],
      'Expires': ['0']
    },
    body: JSON.stringify({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  };
};