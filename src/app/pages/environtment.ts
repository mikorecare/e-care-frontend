export const environment = (() => {
    const defaultUrl = 'http://localhost:4000';
  
    return {
      appVersion: 'v1.0.01',
      production: true,
      defaultUrl,
      apiUrl: `${defaultUrl}/api`,
    };
  })();
  