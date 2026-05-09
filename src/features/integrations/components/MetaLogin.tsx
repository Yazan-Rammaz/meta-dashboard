'use client';

import Script from 'next/script';

export default function MetaLogin() {
  function initFB() {
    (window as any).FB.init({
      appId: process.env.REACT_APP_META_ID,
      cookie: true,
      xfbml: true,
      version: 'v18.0',
    });
  }

  function launchMetaSignup() {
    (window as any).FB.login(
      function (response: any) {
        if (response.authResponse) {
          const code = response.authResponse.code;
          window.parent.postMessage({ type: 'success', code }, '*');
        } else {
          window.parent.postMessage(
            {
              type: 'error',
              error: 'User cancelled login or did not fully authorize.',
            },
            '*'
          );
        }
      },
      {
        config_id: process.env.REACT_APP_META_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
        },
      }
    );
  }

  return (
    <>
      <Script
        id="facebook-sdk-meta"
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={initFB}
        strategy="afterInteractive"
      />
      <div className="w-full h-[300px] flex justify-center items-center">
        <button
          className="px-4 py-2 font-medium text-xs rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white"
          onClick={launchMetaSignup}
        >
          Login with Facebook
        </button>
      </div>
    </>
  );
}
