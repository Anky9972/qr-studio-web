import Script from 'next/script'

interface StructuredDataProps {
  type?: 'Organization' | 'WebApplication' | 'BreadcrumbList' | 'FAQPage' | 'Product'
  data?: Record<string, any>
}

export function StructuredData({ type = 'WebApplication', data }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'QR Studio',
          url: baseUrl,
          logo: `${baseUrl}/images/logo.png`,
          description: 'Professional QR Code Generator and Management Platform',
          foundingDate: '2024',
          sameAs: [
            'https://twitter.com/qrstudio',
            'https://linkedin.com/company/qrstudio',
            'https://github.com/qrstudio',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            email: 'support@qrstudio.com',
            availableLanguage: ['en', 'es', 'fr', 'de', 'pt'],
          },
          ...data,
        }

      case 'WebApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'QR Studio',
          url: baseUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser',
          description: 'Create stunning QR codes in seconds with QR Studio. Professional QR code generator with custom designs, logo embedding, analytics tracking, bulk creation, and team collaboration.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free tier available with premium features',
          },
          featureList: [
            'Custom QR Code Design',
            'Logo Embedding',
            'Analytics and Tracking',
            'Bulk QR Code Generation',
            'Team Collaboration',
            'Dynamic QR Codes',
            'vCard QR Codes',
            'WiFi QR Codes',
            'API Access',
            'Campaign Management',
          ],
          screenshot: `${baseUrl}/images/screenshot.png`,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
            bestRating: '5',
            worstRating: '1',
          },
          ...data,
        }

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.items || [],
        }

      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data?.questions || [],
        }

      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'QR Studio Pro',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web, iOS, Android',
          offers: {
            '@type': 'Offer',
            price: data?.price || '9.99',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '1250',
          },
          ...data,
        }

      default:
        return data
    }
  }

  const structuredData = getStructuredData()

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Helper function to create breadcrumb items
export function createBreadcrumbs(items: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${baseUrl}${item.url}`,
  }))
}

// Helper function to create FAQ items
export function createFAQItems(faqs: Array<{ question: string; answer: string }>) {
  return faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }))
}
