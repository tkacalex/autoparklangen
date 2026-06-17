import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Car,
  Check,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  Route,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { useMemo, useRef } from 'react'
import inventoryData from './data/inventory.json'
import {
  contact,
  hours,
  localKeywords,
  mapsUrl,
  mobileInventoryUrl,
  services,
  vehicleAreas,
} from './data/site'
import type { InventoryData, Vehicle } from './types'

const inventory = inventoryData as InventoryData

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Autopark Langen Außenfläche mit Fahrzeugen' },
  { src: '/images/gallery-2.jpg', alt: 'Fahrzeugbestand auf dem Hof von Autopark Langen' },
  { src: '/images/gallery-3.jpg', alt: 'Transporter und Gebrauchtwagen am Standort Langen' },
  { src: '/images/gallery-4.jpg', alt: 'Autopark Langen Standort Eindruck' },
]

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Fahrzeugbestand', href: '/#fahrzeugbestand' },
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Warum Autopark Langen', href: '/#warum' },
  { label: 'Galerie/Standort', href: '/#standort' },
  { label: 'Kontakt', href: '/kontakt' },
]

function App() {
  const path = window.location.pathname
  const currentPage = useMemo(() => {
    if (path === '/impressum') return <ImpressumPage />
    if (path === '/datenschutz') return <DatenschutzPage />
    if (path === '/kontakt') return <KontaktPage />
    return <HomePage />
  }, [path])

  return (
    <>
      <Header />
      {currentPage}
      <Footer />
    </>
  )
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/#home" aria-label="Autopark Langen Startseite">
        <img src="/logo.png" width="52" height="52" alt="Autopark Langen Logo" />
        <span>
          <strong>Autopark Langen</strong>
          <small>{contact.claim}</small>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Hauptnavigation">
        {navItems.map((item, index) => (
          <a key={item.href} href={item.href} className={index === 0 ? 'active' : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="header-phone" href={contact.phoneHref}>
          <Phone size={17} aria-hidden="true" />
          <span>{contact.phone}</span>
        </a>
        <a className="header-contact" href="/kontakt">
          Kontakt aufnehmen
        </a>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <main>
      <HeroSection />
      <InventorySection />
      <ServicesSection />
      <WhySection />
      <GallerySection />
      <ContactSection />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-media" aria-hidden="true">
        <img src="/images/hero-reference.jpg" alt="" fetchPriority="high" />
      </div>
      <div className="section-shell hero-grid">
        <div className="hero-copy">
          <h1>Autopark Langen</h1>
          <p className="hero-lead">Gebrauchtwagen und Nutzfahrzeuge zu fairen Preisen in Langen</p>
          <p className="hero-text">
            Geprüfte und gepflegte Fahrzeuge, persönliche Beratung, Probefahrt, Finanzierung,
            Zulassungsservice und Inzahlungnahme.
          </p>
          <div className="hero-actions" aria-label="Direkte Aktionen">
            <a className="button button-primary" href="#fahrzeugbestand">
              <FileText size={18} aria-hidden="true" />
              Fahrzeugbestand ansehen
            </a>
            <a className="button button-secondary" href="/kontakt">
              <Phone size={18} aria-hidden="true" />
              Kontakt aufnehmen
            </a>
            <a className="button button-ghost" href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={18} aria-hidden="true" />
              Route planen
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function InventorySection() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const vehicles = inventory.vehicles

  const scroll = (direction: 'left' | 'right') => {
    carouselRef.current?.scrollBy({
      left: direction === 'right' ? 380 : -380,
      behavior: 'smooth',
    })
  }

  return (
    <section className="inventory-section" id="fahrzeugbestand">
      <div className="section-shell">
        <div className="section-heading split-heading">
          <div>
            <h2>Aktuelle Auswahl aus unserem Fahrzeugbestand</h2>
          </div>
          <div className="inventory-actions">
            <a className="button button-dark" href={mobileInventoryUrl} target="_blank" rel="noreferrer">
              Alle Fahrzeuge auf mobile.de ansehen
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <button type="button" className="icon-button" onClick={() => scroll('left')} aria-label="Zurück">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" className="icon-button" onClick={() => scroll('right')} aria-label="Weiter">
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="inventory-source visually-hidden">
          <span>{inventory.note}</span>
          <span>Datenstand: {formatDate(inventory.fetchedAt)}</span>
        </div>

        <div className="vehicle-carousel" ref={carouselRef} tabIndex={0} aria-label="Fahrzeugkarussell">
          {vehicles.slice(0, 5).map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <div className="vehicle-grid" aria-label="Fahrzeugübersicht">
          {vehicles.slice(0, 6).map((vehicle) => (
            <VehicleCard key={`grid-${vehicle.id}`} vehicle={vehicle} compact />
          ))}
        </div>
      </div>
    </section>
  )
}

function VehicleCard({ vehicle, compact = false }: { vehicle: Vehicle; compact?: boolean }) {
  return (
    <article className={compact ? 'vehicle-card compact' : 'vehicle-card'}>
      <a href={vehicle.detailUrl} target="_blank" rel="noreferrer" aria-label={`${vehicle.title} auf mobile.de öffnen`}>
        <div className="vehicle-image">
          <img
            src={vehicle.imageUrl ?? '/images/yard-1.jpeg'}
            alt={vehicle.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.src = '/images/yard-1.jpeg'
            }}
          />
        </div>
        <div className="vehicle-content">
          <div className="vehicle-title-row">
            <h3>{vehicle.title}</h3>
            <ExternalLink size={16} aria-hidden="true" />
          </div>
          <div className="vehicle-facts">
            <span>EZ {vehicle.firstRegistration}</span>
            <span>{vehicle.mileage}</span>
            <span>{vehicle.power}</span>
            <span>{vehicle.fuel}</span>
            <span>{vehicle.category}</span>
          </div>
          <div className="vehicle-price">
            {vehicle.priceGross && <strong>{vehicle.priceGross}</strong>}
            {vehicle.priceNet && <span>{vehicle.priceNet}</span>}
          </div>
          <span className="vehicle-link">
            Details auf mobile.de
            <ExternalLink size={13} aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  )
}

function ServicesSection() {
  const icons = [Car, ShieldCheck, BadgeCheck, Wrench]

  return (
    <section className="services-section" id="leistungen">
      <div className="section-shell">
        <div className="section-heading">
          <span className="section-kicker">Leistungen</span>
          <h2>Alles rund um Kauf, Übergabe und Fahrzeugservice</h2>
          <p>
            Persönliche Beratung, transparente Fahrzeugauswahl und praktische Services für private und gewerbliche Kunden.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length]
            return (
              <div className="service-item" key={service}>
                <Icon size={22} aria-hidden="true" />
                <span>{service}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="why-section" id="warum">
      <div className="section-shell why-grid">
        <div className="section-heading">
          <span className="section-kicker">Warum Autopark Langen</span>
          <h2>Seriöser Händler für Gebrauchtwagen und Nutzfahrzeuge im Rhein-Main Gebiet</h2>
          <p>
            Autopark Langen sitzt gut erreichbar zwischen Dreieich, Egelsbach, Neu-Isenburg und Frankfurt.
            Der Bestand ist stark auf Transporter, Kastenwagen und Nutzfahrzeuge ausgerichtet.
          </p>
        </div>
        <div className="focus-panel">
          {vehicleAreas.map((area) => (
            <div key={area}>
              <Check size={18} aria-hidden="true" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section-shell keyword-line" aria-label="Lokale Suchbegriffe">
        {localKeywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
    </section>
  )
}

function GallerySection() {
  return (
    <section className="gallery-section" id="standort">
      <div className="section-shell">
        <div className="section-heading split-heading">
          <div>
            <span className="section-kicker">Galerie/Standort</span>
            <h2>Standort in Langen mit direktem Kontakt</h2>
            <p>
              Bilder aus dem bestehenden Kundenauftritt. Keine Stockfotos, keine erfundenen Showroom Szenen.
            </p>
          </div>
          <a className="button button-secondary" href={mapsUrl} target="_blank" rel="noreferrer">
            <MapPin size={18} aria-hidden="true" />
            Google Maps öffnen
          </a>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact-section" id="kontakt">
      <div className="section-shell contact-grid">
        <div>
          <span className="section-kicker">Kontakt</span>
          <h2>Direkt anrufen, mailen oder Route planen</h2>
          <p>
            Für Fahrzeugfragen, Probefahrt, Finanzierung, Inzahlungnahme oder Zulassungsservice am besten direkt Kontakt aufnehmen.
          </p>
          <div className="contact-actions">
            <a className="button button-primary" href={contact.phoneHref}>
              <Phone size={18} aria-hidden="true" />
              {contact.phone}
            </a>
            <a className="button button-secondary" href={contact.emailHref}>
              <Mail size={18} aria-hidden="true" />
              {contact.email}
            </a>
            <a className="button button-ghost" href={mapsUrl} target="_blank" rel="noreferrer">
              <Route size={18} aria-hidden="true" />
              Route planen
            </a>
          </div>
        </div>
        <div className="contact-card">
          <h3>{contact.name}</h3>
          <p>{contact.address}</p>
          <div className="hours-list">
            {hours.map((entry) => (
              <div key={entry.day}>
                <span>{entry.day}</span>
                <strong>{entry.time}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function KontaktPage() {
  return (
    <main className="page-main">
      <section className="section-shell legal-page">
        <span className="section-kicker">Kontakt</span>
        <h1>Kontakt aufnehmen</h1>
        <ContactSection />
      </section>
    </main>
  )
}

function ImpressumPage() {
  return (
    <main className="page-main">
      <section className="section-shell legal-page">
        <span className="section-kicker">Impressum</span>
        <h1>Impressum</h1>
        <div className="legal-card">
          <h2>Verantwortlich</h2>
          <p>
            {contact.responsible}
            <br />
            {contact.street}
            <br />
            {contact.city}
          </p>
          <h2>Vertreten durch</h2>
          <p>{contact.representative}</p>
          <h2>Kontakt</h2>
          <p>
            Mobil: <a href={contact.phoneHref}>0152 02588606</a>
            <br />
            E-Mail: <a href={contact.emailHref}>{contact.email}</a>
          </p>
          <h2>Umsatzsteuer-ID</h2>
          <p>{contact.vatId}</p>
          <h2>Streitschlichtung</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
          <h2>Haftung für Inhalte</h2>
          <p>
            Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für Vollständigkeit, Richtigkeit und Aktualität der
            Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir nach den allgemeinen Gesetzen
            für eigene Inhalte auf diesen Seiten verantwortlich.
          </p>
          <h2>Haftung für Links</h2>
          <p>
            Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für
            diese fremden Inhalte übernehmen wir keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
            Anbieter oder Betreiber verantwortlich.
          </p>
          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen
            Urheberrecht. Beiträge Dritter werden als solche gekennzeichnet. Bei Bekanntwerden von Rechtsverletzungen
            entfernen wir entsprechende Inhalte.
          </p>
        </div>
      </section>
    </main>
  )
}

function DatenschutzPage() {
  return (
    <main className="page-main">
      <section className="section-shell legal-page">
        <span className="section-kicker">Datenschutz</span>
        <h1>Datenschutzerklärung</h1>
        <div className="legal-card">
          <h2>Datenschutz auf einen Blick</h2>
          <p>
            Wir behandeln personenbezogene Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.
            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
          <h2>Verantwortliche Stelle</h2>
          <p>
            Kraftfahrzeuge Alpay / Autopark Langen
            <br />
            {contact.street}
            <br />
            {contact.city}
            <br />
            Telefon: <a href={contact.phoneHref}>{contact.phone}</a>
            <br />
            E-Mail: <a href={contact.emailHref}>{contact.email}</a>
          </p>
          <h2>Erfassung technischer Daten</h2>
          <p>
            Beim Besuch der Website werden durch den Hosting Anbieter technische Daten verarbeitet, etwa Browsertyp,
            Betriebssystem, Referrer URL, Uhrzeit der Serveranfrage und IP Adresse. Diese Verarbeitung ist notwendig, um
            die Website sicher und stabil bereitzustellen.
          </p>
          <h2>Kontakt per E-Mail oder Telefon</h2>
          <p>
            Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage.
            Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </p>
          <h2>Cookies, Analytics und Tracking</h2>
          <p>
            Diese Website bindet keine Analytics Tools und keine unnötigen Tracking Skripte ein. Es wird kein Cookie Banner
            angezeigt, weil auf der Website keine nicht notwendigen Cookies gesetzt werden.
          </p>
          <h2>Externe Links und Medien</h2>
          <p>
            Links zu mobile.de und Google Maps öffnen externe Angebote. Fahrzeugbilder im Bestand können über die
            mobile.de Bildinfrastruktur geladen werden. Beim Aufruf externer Dienste gelten die Datenschutzbestimmungen
            der jeweiligen Anbieter.
          </p>
          <h2>Ihre Rechte</h2>
          <p>
            Sie haben im Rahmen der gesetzlichen Bestimmungen das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit und Beschwerde bei einer zuständigen Aufsichtsbehörde.
            Außerdem können Sie einer Verarbeitung unter bestimmten Voraussetzungen widersprechen.
          </p>
          <h2>Widerspruch gegen Werbe-E-Mails</h2>
          <p>
            Der Nutzung der im Impressum veröffentlichten Kontaktdaten zur Übersendung nicht ausdrücklich angeforderter
            Werbung wird widersprochen.
          </p>
        </div>
      </section>
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div>
          <a className="brand footer-brand" href="/#home">
            <img src="/logo.png" width="48" height="48" alt="Autopark Langen Logo" />
            <span>
              <strong>Autopark Langen</strong>
              <small>{contact.claim}</small>
            </span>
          </a>
          <p>{contact.address}</p>
        </div>
        <div className="footer-links">
          <a href="/kontakt">Kontakt</a>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href={mobileInventoryUrl} target="_blank" rel="noreferrer">
            mobile.de
          </a>
        </div>
      </div>
    </footer>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('de-DE').format(date)
}

export default App
