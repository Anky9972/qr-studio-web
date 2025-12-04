// Retargeting Pixel Manager - Inject tracking pixels before redirect
import { PixelConfig, PixelProvider } from '@/types/routing';

/**
 * Generate pixel tracking scripts for landing page
 */
export function generatePixelScripts(pixels: PixelConfig[]): string {
  const scripts = pixels
    .filter(pixel => pixel.active)
    .map(pixel => {
      switch (pixel.provider) {
        case 'facebook':
          return generateFacebookPixel(pixel);
        case 'google':
          return generateGoogleTagManager(pixel);
        case 'linkedin':
          return generateLinkedInPixel(pixel);
        case 'tiktok':
          return generateTikTokPixel(pixel);
        case 'twitter':
          return generateTwitterPixel(pixel);
        case 'custom':
          return pixel.scriptContent || '';
        default:
          return '';
      }
    })
    .filter(script => script.length > 0);

  return scripts.join('\n\n');
}

/**
 * Facebook Pixel
 */
function generateFacebookPixel(pixel: PixelConfig): string {
  const events = pixel.events.length > 0 ? pixel.events : ['PageView'];
  
  return `
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixel.pixelId}');
${events.map(event => `fbq('track', '${event}');`).join('\n')}
</script>
<noscript>
  <img height="1" width="1" style="display:none"
       src="https://www.facebook.com/tr?id=${pixel.pixelId}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
`.trim();
}

/**
 * Google Tag Manager
 */
function generateGoogleTagManager(pixel: PixelConfig): string {
  return `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${pixel.pixelId}');</script>
<!-- End Google Tag Manager -->

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${pixel.pixelId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`.trim();
}

/**
 * LinkedIn Insight Tag
 */
function generateLinkedInPixel(pixel: PixelConfig): string {
  return `
<!-- LinkedIn Insight Tag -->
<script type="text/javascript">
_linkedin_partner_id = "${pixel.pixelId}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" 
     src="https://px.ads.linkedin.com/collect/?pid=${pixel.pixelId}&fmt=gif" />
</noscript>
<!-- End LinkedIn Insight Tag -->
`.trim();
}

/**
 * TikTok Pixel
 */
function generateTikTokPixel(pixel: PixelConfig): string {
  const events = pixel.events.length > 0 ? pixel.events : ['PageView'];
  
  return `
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${pixel.pixelId}');
  ${events.map(event => `ttq.track('${event}');`).join('\n')}
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->
`.trim();
}

/**
 * Twitter (X) Pixel
 */
function generateTwitterPixel(pixel: PixelConfig): string {
  return `
<!-- Twitter Pixel Code -->
<script>
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','${pixel.pixelId}');
</script>
<!-- End Twitter Pixel Code -->
`.trim();
}

/**
 * Generate complete landing page HTML with pixels
 */
export function generatePixelLandingPage(
  pixels: PixelConfig[],
  destination: string,
  delayMs: number = 1000,
  brandName: string = 'QR Studio'
): string {
  const pixelScripts = generatePixelScripts(pixels);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Redirecting...</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    p {
      opacity: 0.9;
      font-size: 0.95rem;
    }
    .progress {
      width: 200px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      margin: 1.5rem auto 0;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: white;
      width: 0%;
      animation: progress ${delayMs}ms linear forwards;
    }
    @keyframes progress {
      to { width: 100%; }
    }
  </style>
  
  ${pixelScripts}
  
  <script>
    // Redirect after delay to allow pixels to fire
    setTimeout(function() {
      window.location.href = '${destination}';
    }, ${delayMs});
    
    // Fallback: redirect immediately if user clicks
    document.addEventListener('click', function() {
      window.location.href = '${destination}';
    });
  </script>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h1>Redirecting...</h1>
    <p>You'll be redirected in a moment</p>
    <div class="progress">
      <div class="progress-bar"></div>
    </div>
  </div>
</body>
</html>
`.trim();
}

/**
 * Validate pixel configuration
 */
export function validatePixelConfig(pixel: Partial<PixelConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!pixel.provider) {
    errors.push('Provider is required');
  }

  if (!pixel.pixelId || pixel.pixelId.trim() === '') {
    errors.push('Pixel ID is required');
  }

  if (pixel.provider === 'custom' && !pixel.scriptContent) {
    errors.push('Script content is required for custom pixels');
  }

  if (pixel.delayRedirect && (pixel.delayRedirect < 0 || pixel.delayRedirect > 10000)) {
    errors.push('Delay must be between 0 and 10000 milliseconds');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get pixel provider display name
 */
export function getPixelProviderName(provider: PixelProvider): string {
  const names: Record<PixelProvider, string> = {
    facebook: 'Facebook Pixel',
    google: 'Google Tag Manager',
    linkedin: 'LinkedIn Insight Tag',
    tiktok: 'TikTok Pixel',
    twitter: 'Twitter (X) Pixel',
    custom: 'Custom Script',
  };
  
  return names[provider] || provider;
}

/**
 * Get recommended delay for pixel provider
 */
export function getRecommendedDelay(provider: PixelProvider): number {
  const delays: Record<PixelProvider, number> = {
    facebook: 1000,
    google: 1500,
    linkedin: 1000,
    tiktok: 1000,
    twitter: 800,
    custom: 1000,
  };
  
  return delays[provider] || 1000;
}
