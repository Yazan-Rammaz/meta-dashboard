'use client';

import Script from 'next/script';

export default function WhatsappLogin() {
  function initFB() {
    (window as any).FB.init({
      appId: process.env.REACT_APP_WHATSAPP_ID,
      cookie: true,
      xfbml: true,
      version: 'v18.0',
    });
  }

  function launchWhatsAppSignup() {
    (window as any).FB.login(
      function (response: any) {
        if (response.authResponse) {
          const code = response.authResponse.code;
          const messageData = { type: 'success', code };
          console.log('WhatsApp Group Data Sent:', messageData);
          window.parent.postMessage(messageData, '*');
        } else {
          const errorData = {
            type: 'error',
            error: 'User cancelled login or did not fully authorize.',
          };
          console.log('WhatsApp Group Error Data:', errorData);
          window.parent.postMessage(errorData, '*');
        }
      },
      {
        config_id: process.env.REACT_APP_WHATSAPP_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          version: 'v3',
          featureType: 'whatsapp_business_app_onboarding',
          features: [
            { name: 'marketing_messages_lite' },
            { name: 'app_only_install' },
          ],
        },
      }
    );
  }

  return (
    <>
      <Script
        id="facebook-sdk-whatsapp"
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={initFB}
        strategy="afterInteractive"
      />
      <div className="w-full h-[300px] flex justify-center items-center">
        <button
          className="px-4 py-2 font-medium text-xs rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white"
          onClick={launchWhatsAppSignup}
        >
          Login with Facebook
        </button>
      </div>
    </>
  );
}
