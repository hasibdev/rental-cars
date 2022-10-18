// import App from '../App.vue'
import LoginPage from '../pages/auth/LoginPage.vue'
import AdminLogin from '../pages/auth/AdminLogin.vue'
import addCustomer from '../pages/dashboard/customers/AddCustomer.vue'
import EditCustomer from '../pages/dashboard/customers/EditCustomer.vue'
import AllCustomers from '../pages/dashboard/customers/AllCustomers.vue'
import DashboardHomePage from '../pages/dashboard/DashboardHomePage.vue'
import InvoiceCreate from '../pages/dashboard/invoice/InvoiceCreate.vue'
import InvoiceEdit from '../pages/dashboard/invoice/InvoiceEdit.vue'
import InvoiceCancel from '../pages/dashboard/invoice/InvoiceCancel.vue'
import InvoicePreview from '../pages/dashboard/invoice/invoicePreview.vue'
import InvoiceIndex from '../pages/dashboard/invoice/InvoiceIndex.vue'
import ReservationCreate from '../pages/dashboard/reservations/ReservationCreate.vue'
import ReservationsIndex from '../pages/dashboard/reservations/ReservationsIndex.vue'
import ReservationView from '../pages/dashboard/reservations/ReservationView.vue'
import ReservationUpdate from '../pages/dashboard/reservations/ReservationUpdate.vue'
import ReservationEndRental from '../pages/dashboard/reservations/ReservationEndRental.vue'
import RegisterPayment from '../pages/dashboard/payments/register.vue'
import TheDefault from "@/layouts/TheDefault.vue"
import EmptyLayout from "@/layouts/EmptyLayout.vue"
import Home from '../pages/Home.vue'
import PageNotFound from '../pages/PageNotFound.vue'
import TheDashboard from '@/layouts/TheDashboard.vue'

import auth from '../middleware/auth'
import guest from '../middleware/guest'

const routes = [
  // Home
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Startseite',
      layout: TheDefault,
    }
  },

  // Privacy
  {
    path: '/datenschutz',
    name: "Privacy",
    component: () => import('../pages/Privacy.vue'),
    meta: {
      title: 'Datenschutz',
      layout: TheDefault,
    }
  },
  // Legal
  {
    path: '/impressum',
    name: 'Legal',
    component: () => import('../pages/Legal.vue'),
    meta: {
      title: 'Impressum',
      layout: TheDefault,
    }
  },

  // Terms allgemeine-geschäftsbedingungen ä as ae
  {
    path: '/Terms',
    name: 'Terms',
    component: () => import('../pages/Terms.vue'),
    meta: {
      title: 'Geschäftsbedingungen',
      layout: TheDefault,
    }
  },
  {
    path: '/confirmation/:id',
    name: "confirmation",
    component: () => import('../pages/Confirmation.vue'),
    meta: {
      title: 'Confirmation',
      layout: TheDefault
    }
  },
  {
    path: '/reservation-decline/:id',
    name: "reservation-decline",
    component: () => import('../pages/declineConfirmation.vue'),
    meta: {
      title: 'Confirmation',
      layout: TheDefault
    }
  },

  // Login
  {
    path: '/anmeldung',
    name: 'admin-login',
    component: AdminLogin,
    meta: {
      title: 'Anmeldung',
      middleware: [guest],
      layout: EmptyLayout
    }
  },


  // authentication
  {
    path: '/auth',
    component: LoginPage,
    name: 'Auth',
    redirect: {
      name: 'loginPage'
    },
    children: [
      {
        path: '/anmeldung',
        name: 'loginPage',
        component: DashboardHomePage,
        meta: {
          title: 'Anmeldung',
          layout: EmptyLayout
        }
      },
    ]
  },

  // dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardHomePage,
    meta: {
      title: 'Dashboard',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  //Profile
  {
    path: '/profil',
    name: 'Profile',
    component: () => import('@/pages/dashboard/profile/index.vue'),
    meta: {
      title: 'Profil',
      middleware: [auth],
      layout: TheDashboard
    },
  },
  //Requests
  {
    path: '/anfragen',
    name: 'Requests',
    component: () => import('@/pages/dashboard/requests/index.vue'),
    meta: {
      title: 'Anfragen',
      middleware: [auth],
      layout: TheDashboard
    },
  },
  //Coming Soon demnächst
  {
    path: '/demnächst',
    name: 'coming-soon',
    component: () => import('@/pages/dashboard/coming-soon/index.vue'),
    meta: {
      title: 'Demnächst',
      layout: TheDashboard
    },
  },
  // Settings einstellungen
  {
    path: '/einstellungen',
    name: 'Settings',
    component: () => import('@/pages/dashboard/settings/index.vue'),
    meta: {
      title: 'Einstellungen',
      middleware: [auth],
      layout: TheDashboard
    },
  },


  // Vehicle data fahrzeugdaten
  {
    path: '/einstellungen/fahrzeugdaten',
    name: "vehicle-data",
    component: () => import('@/pages/dashboard/settings/vehicle-data/index.vue'),
    meta: {
      title: 'Einstellungen',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // Billing
  {
    path: '/einstellungen/abrechnung',
    name: "billing",
    component: () => import('@/pages/dashboard/settings/billing/index.vue'),
    meta: {
      title: 'Abrechnung',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // User Manage benutzer-verwaltung
  {
    path: '/einstellungen/benutzer-verwaltung',
    name: "user-manage",
    component: () => import('@/pages/dashboard/settings/user-manage/index.vue'),
    meta: {
      title: 'Benutzer verwaltung',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // Legal
  {
    path: '/einstellungen/impressum',
    name: "legal-settings",
    component: () => import('../pages/dashboard/settings/legal.vue'),
    meta: {
      title: 'Impressum',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // General Settings
  {
    path: '/einstellungen/allgemein',
    name: "general",
    component: () => import('@/pages/dashboard/settings/general.vue'),
    meta: {
      title: 'Allgemein',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // Location Management
  {
    path: '/einstellungen/standort-verwaltung',
    name: "location-manage",
    component: () => import('@/pages/dashboard/settings/location-manage/index.vue'),
    meta: {
      title: 'Standort verwaltung',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // Bookin calendar
  {
    path: '/buchungskalender',
    name: "booking-calendar",
    component: () => import('@/pages/dashboard/calendar/index.vue'),
    meta: {
      title: 'Buchungs kalender',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/kunden',
    component: AllCustomers,
    name: 'Customers',
    meta: {
      title: 'Kunden',
      middleware: [auth],
      layout: TheDashboard
    },
  },

  // Add customer
  {
    path: '/customer/create',
    name: "addCustomer",
    component: addCustomer,
    meta: {
      title: 'Kunden hinzufügen',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  {
    path: "/kunden/bearbeiten/:id",
    name: "EditCustomer",
    component: EditCustomer,
    meta: {
      title: 'Kunden bearbeiten',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // Fleets
  {
    path: '/fuhrparks',
    name: "FleetIndex",
    component: () => import('@/pages/dashboard/fleets/index.vue'),
    meta: {
      title: 'Fuhrparks',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/flotte/erstellen',
    name: "create",
    component: () => import('@/pages/dashboard/fleets/create.vue'),
    meta: {
      title: 'Flotte erstellen',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/flotte/aktualisieren/:id',
    name: "update",
    component: () => import('@/pages/dashboard/fleets/update.vue'),
    meta: {
      title: 'Flotte aktualisieren',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/flotte/ansicht/:id',
    name: "view",
    component: () => import('@/pages/dashboard/fleets/view.vue'),
    meta: {

      title: 'Flotte',
      middleware: [auth],
      layout: TheDashboard

    }
  },

  // Reservation
  {
    path: '/reservierungen',
    name: "ReservationsIndex",
    component: ReservationsIndex,
    meta: {
      title: 'Reservierungen',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // Reservation create
  {
    path: '/reservierungen/erstellen',
    name: "ReservationCreate",
    component: ReservationCreate,
    meta: {
      title: 'Reservierungen erstellen',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // Reservation contract preview
  {
    path: '/reservierungen/vertrags-vorschau/:id',
    name: "ReservationContract",
    component: () => import('@/pages/dashboard/reservations/ContractPreview.vue'),
    meta: {
      title: 'Reservierungen vorschau',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // reservation preview
  {
    path: '/reservierungen/reservierungsvorschau/:id',
    name: "ReservationPreview",
    component: () => import('@/pages/dashboard/reservations/view.vue'),
    meta: {
      title: 'Reservierungen vorschau',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/reservierungen/reservierungsdateien/:id',
    name: "ReservationFiles",
    component: () => import('@/pages/dashboard/reservations/files.vue'),
    meta: {
      title: 'Reservation Files',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/reservierungen/:id',
    name: "ReservationView",
    component: ReservationView,
    meta: {
      title: 'reservierungen',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/reservierungen/aktualisieren/:id',
    name: "ReservationUpdate",
    component: ReservationUpdate,
    meta: {
      title: 'Reservierungen aktualisieren',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/reservierungen/end-miete/:id',
    name: "ReservationEndRental",
    component: ReservationEndRental,
    meta: {
      title: 'Reservierungen',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // Invoices
  {
    path: '/rechnung',
    name: "rechnung",
    component: InvoiceIndex,
    meta: {
      title: 'Invoice',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  {
    path: '/rechnung/erstellen',
    name: "InvoiceCreate",
    component: InvoiceCreate,
    meta: {
      title: 'Create | Invoice',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  {
    path: '/rechnung/erzeugen-rechnung',
    name: "generate-invoice",
    component: () => import("../pages/dashboard/invoice/GenerateInvoice.vue"),
    meta: {
      title: 'Generate | Invoice',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // Edit
  {
    path: '/rechnung/bearbeiten/:id',
    name: "InvoiceEdit",
    component: InvoiceEdit,
    meta: {
      title: 'Update | Invoice',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // cancel
  {
    path: '/rechnung/stornieren/:id',
    name: "InvoiceCancel",
    component: InvoiceCancel,
    meta: {
      title: 'Cancel | Invoice',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // cancel invoice/cancel/:id/view',
  {
    path: '/rechnung/stornieren/:id/ansicht',
    name: "InvoiceCancelView",
    component: () => import('../pages/dashboard/invoice/CancleView.vue'),
    meta: {
      title: 'View Cancle | Invoice',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // /invoice/preview/:id
  {
    path: '/rechnung/vorschau/:id',
    name: "InvoicePreview",
    component: InvoicePreview,
    meta: {
      title: 'Preview | Invoice',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  //  /payments/:invoiceId/register
  {
    path: '/zahlungen/:invoiceId/registrieren',
    name: "RegisterPayment",
    component: RegisterPayment,
    meta: {
      title: 'Register Payment',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  //  /payments/:invoiceId/success
  {
    path: '/zahlungen/:invoiceId/erfolg',
    name: "RegisterPaymentSuccess",
    component: () => import('../pages/dashboard/payments/success.vue'),
    meta: {
      title: 'Payment Success',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // payments/:invoiceId/view
  {
    path: '/zahlungen/:invoiceId/ansicht',
    name: "RegisterPaymentView",
    component: () => import('../pages/dashboard/payments/view.vue'),
    meta: {
      title: 'Payment View',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // Speed Tickets
  {
    path: '/strafzettel',
    name: "SpeedingTicketsIndex",
    component: () => import('@/pages/dashboard/speeding-tickets/index.vue'),
    meta: {
      title: 'Strafzettel',
      middleware: [auth],
      layout: TheDashboard
    }
  },

  // Accident Archive
  {
    path: '/unfall-archiv',
    name: "AccidentArchiveIndex",
    component: () => import('@/pages/dashboard/accident-archive/index.vue'),
    meta: {
      title: 'Unfall archiv',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // /notes notizen
  {
    path: '/notizen',
    name: "Notes",
    component: () => import('@/pages/dashboard/notes/index.vue'),
    meta: {
      title: 'Notes',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // /notes/create
  {
    path: '/notizen/erstellen',
    name: "Notes Create",
    component: () => import('@/pages/dashboard/notes/add.vue'),
    meta: {
      title: 'Notes',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  // /notes/update/:id aktualisieren
  {
    path: '/notizen/aktualisieren/:id',
    name: "Notes Update",
    component: () => import('@/pages/dashboard/notes/update.vue'),
    meta: {
      title: 'Notes',
      middleware: [auth],
      layout: TheDashboard
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: "Not found",
    component: PageNotFound,
    meta: {
      title: 'Page not found',
      layout: TheDefault
    }
  },
]

export default routes
