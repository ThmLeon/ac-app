export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "0_Metadata": {
        Row: {
          created_at: string
          ID: number
          Key: string
          Titel: string
          Value: string
        }
        Insert: {
          created_at?: string
          ID?: number
          Key: string
          Titel: string
          Value: string
        }
        Update: {
          created_at?: string
          ID?: number
          Key?: string
          Titel?: string
          Value?: string
        }
        Relationships: []
      }
      "0_UserFeedback": {
        Row: {
          AppSeite: string | null
          Beschreibung: string | null
          created_at: string
          ID: number
          Kategorie: string | null
          Prioritaet: string | null
          Titel: string | null
        }
        Insert: {
          AppSeite?: string | null
          Beschreibung?: string | null
          created_at?: string
          ID?: number
          Kategorie?: string | null
          Prioritaet?: string | null
          Titel?: string | null
        }
        Update: {
          AppSeite?: string | null
          Beschreibung?: string | null
          created_at?: string
          ID?: number
          Kategorie?: string | null
          Prioritaet?: string | null
          Titel?: string | null
        }
        Relationships: []
      }
      "1_BueroDienstAufgaben": {
        Row: {
          AufgabeErledigt: boolean | null
          AufgabeMasterID: number | null
          BueroDienstID: number | null
          created_at: string
          ID: number
          Titel: string | null
        }
        Insert: {
          AufgabeErledigt?: boolean | null
          AufgabeMasterID?: number | null
          BueroDienstID?: number | null
          created_at?: string
          ID?: number
          Titel?: string | null
        }
        Update: {
          AufgabeErledigt?: boolean | null
          AufgabeMasterID?: number | null
          BueroDienstID?: number | null
          created_at?: string
          ID?: number
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "1_BueroDienstAufgaben_AufgabeMasterID_fkey"
            columns: ["AufgabeMasterID"]
            isOneToOne: false
            referencedRelation: "1_BueroDiensteAufgabenMaster"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "1_BueroDienstAufgaben_BueroDienstID_fkey"
            columns: ["BueroDienstID"]
            isOneToOne: false
            referencedRelation: "1_BueroDienste"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_BueroDienste": {
        Row: {
          Abgenommen: boolean | null
          AbgenommenVonMitgliedID: number | null
          created_at: string
          Datum: string | null
          ID: number
          TeilnehmerAnzahl: number | null
          TeilnehmerEingetragen: number | null
          Titel: string | null
        }
        Insert: {
          Abgenommen?: boolean | null
          AbgenommenVonMitgliedID?: number | null
          created_at?: string
          Datum?: string | null
          ID?: number
          TeilnehmerAnzahl?: number | null
          TeilnehmerEingetragen?: number | null
          Titel?: string | null
        }
        Update: {
          Abgenommen?: boolean | null
          AbgenommenVonMitgliedID?: number | null
          created_at?: string
          Datum?: string | null
          ID?: number
          TeilnehmerAnzahl?: number | null
          TeilnehmerEingetragen?: number | null
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "1_BueroDienste_AbgenommenVonMitgliedID_fkey"
            columns: ["AbgenommenVonMitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_BueroDiensteAufgabenMaster": {
        Row: {
          Aufgabe: string | null
          AufgabeBereich: string | null
          AufgabeBeschreibung: string | null
          created_at: string
          ID: number
          Titel: string | null
        }
        Insert: {
          Aufgabe?: string | null
          AufgabeBereich?: string | null
          AufgabeBeschreibung?: string | null
          created_at?: string
          ID?: number
          Titel?: string | null
        }
        Update: {
          Aufgabe?: string | null
          AufgabeBereich?: string | null
          AufgabeBeschreibung?: string | null
          created_at?: string
          ID?: number
          Titel?: string | null
        }
        Relationships: []
      }
      "1_BueroDienstTeilnehmer": {
        Row: {
          BueroDienstID: number | null
          created_at: string
          ID: number
          MitgliedID: number | null
        }
        Insert: {
          BueroDienstID?: number | null
          created_at?: string
          ID?: number
          MitgliedID?: number | null
        }
        Update: {
          BueroDienstID?: number | null
          created_at?: string
          ID?: number
          MitgliedID?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "1_BueroDienstTeilnehmer_BueroDienstID_fkey"
            columns: ["BueroDienstID"]
            isOneToOne: false
            referencedRelation: "1_BueroDienste"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "1_BueroDienstTeilnehmer_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_Mitglieder": {
        Row: {
          Anwaertergeneration: string | null
          Art:
            | Database["public"]["Enums"]["MitgliedsstatusAktivPassivEhemalig"]
            | null
          Aufnahmedatum: string | null
          AusnahmeMVs: boolean | null
          AusnahmeVBTs: boolean | null
          AzureSync: boolean | null
          Beraterstufe: Database["public"]["Enums"]["Beraterstufe"] | null
          BIC: string | null
          CollmexID: number | null
          created_at: string
          EmailAC: string | null
          EmailPrivat: string | null
          Geburtstag: string | null
          Generation: number | null
          Handy: string | null
          Hausnummer: string | null
          IBAN: string | null
          ID: number
          IstWechsler: boolean | null
          Kleinunternehmerregelung: boolean | null
          Legacy_ID: number | null
          LinkedInJSON: string | null
          LinkedInProfile: string | null
          Mandatsreferenz: string | null
          MandatUnterzeichnetAm: string | null
          Nachname: string | null
          PassivScoreAusnahme: boolean | null
          Postleitzahl: string | null
          Rolle:
            | Database["public"]["Enums"]["MitgliedsrolleAlumniAnwaerterMitglied"]
            | null
          Rueckkehrdatum: string | null
          Stadt: string | null
          Steuernummer: string | null
          Strasse: string | null
          Titel: string | null
          Traineegeneration: string | null
          TransponderID: string | null
          UserID: string | null
          Vorname: string | null
          Weiblich: boolean | null
        }
        Insert: {
          Anwaertergeneration?: string | null
          Art?:
            | Database["public"]["Enums"]["MitgliedsstatusAktivPassivEhemalig"]
            | null
          Aufnahmedatum?: string | null
          AusnahmeMVs?: boolean | null
          AusnahmeVBTs?: boolean | null
          AzureSync?: boolean | null
          Beraterstufe?: Database["public"]["Enums"]["Beraterstufe"] | null
          BIC?: string | null
          CollmexID?: number | null
          created_at?: string
          EmailAC?: string | null
          EmailPrivat?: string | null
          Geburtstag?: string | null
          Generation?: number | null
          Handy?: string | null
          Hausnummer?: string | null
          IBAN?: string | null
          ID?: number
          IstWechsler?: boolean | null
          Kleinunternehmerregelung?: boolean | null
          Legacy_ID?: number | null
          LinkedInJSON?: string | null
          LinkedInProfile?: string | null
          Mandatsreferenz?: string | null
          MandatUnterzeichnetAm?: string | null
          Nachname?: string | null
          PassivScoreAusnahme?: boolean | null
          Postleitzahl?: string | null
          Rolle?:
            | Database["public"]["Enums"]["MitgliedsrolleAlumniAnwaerterMitglied"]
            | null
          Rueckkehrdatum?: string | null
          Stadt?: string | null
          Steuernummer?: string | null
          Strasse?: string | null
          Titel?: string | null
          Traineegeneration?: string | null
          TransponderID?: string | null
          UserID?: string | null
          Vorname?: string | null
          Weiblich?: boolean | null
        }
        Update: {
          Anwaertergeneration?: string | null
          Art?:
            | Database["public"]["Enums"]["MitgliedsstatusAktivPassivEhemalig"]
            | null
          Aufnahmedatum?: string | null
          AusnahmeMVs?: boolean | null
          AusnahmeVBTs?: boolean | null
          AzureSync?: boolean | null
          Beraterstufe?: Database["public"]["Enums"]["Beraterstufe"] | null
          BIC?: string | null
          CollmexID?: number | null
          created_at?: string
          EmailAC?: string | null
          EmailPrivat?: string | null
          Geburtstag?: string | null
          Generation?: number | null
          Handy?: string | null
          Hausnummer?: string | null
          IBAN?: string | null
          ID?: number
          IstWechsler?: boolean | null
          Kleinunternehmerregelung?: boolean | null
          Legacy_ID?: number | null
          LinkedInJSON?: string | null
          LinkedInProfile?: string | null
          Mandatsreferenz?: string | null
          MandatUnterzeichnetAm?: string | null
          Nachname?: string | null
          PassivScoreAusnahme?: boolean | null
          Postleitzahl?: string | null
          Rolle?:
            | Database["public"]["Enums"]["MitgliedsrolleAlumniAnwaerterMitglied"]
            | null
          Rueckkehrdatum?: string | null
          Stadt?: string | null
          Steuernummer?: string | null
          Strasse?: string | null
          Titel?: string | null
          Traineegeneration?: string | null
          TransponderID?: string | null
          UserID?: string | null
          Vorname?: string | null
          Weiblich?: boolean | null
        }
        Relationships: []
      }
      "1_MitgliedGuthaben": {
        Row: {
          BonusPunkte: number | null
          created_at: string
          ID: number
          MitgliedID: number | null
          Saldo: number | null
          Titel: string | null
        }
        Insert: {
          BonusPunkte?: number | null
          created_at?: string
          ID?: number
          MitgliedID?: number | null
          Saldo?: number | null
          Titel?: string | null
        }
        Update: {
          BonusPunkte?: number | null
          created_at?: string
          ID?: number
          MitgliedID?: number | null
          Saldo?: number | null
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "1_MitgliedGuthaben_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_MitgliedPassivScore": {
        Row: {
          Aktiv: boolean | null
          created_at: string
          Datum: string | null
          ID: number
          MitgliedID: number | null
          MVEntschuldigt: number | null
          MVUnentschuldigt: number | null
          PassivScore: number | null
          Titel: string | null
          VBTEntschuldigt: number | null
          VBTUnentschuldigt: number | null
        }
        Insert: {
          Aktiv?: boolean | null
          created_at?: string
          Datum?: string | null
          ID?: number
          MitgliedID?: number | null
          MVEntschuldigt?: number | null
          MVUnentschuldigt?: number | null
          PassivScore?: number | null
          Titel?: string | null
          VBTEntschuldigt?: number | null
          VBTUnentschuldigt?: number | null
        }
        Update: {
          Aktiv?: boolean | null
          created_at?: string
          Datum?: string | null
          ID?: number
          MitgliedID?: number | null
          MVEntschuldigt?: number | null
          MVUnentschuldigt?: number | null
          PassivScore?: number | null
          Titel?: string | null
          VBTEntschuldigt?: number | null
          VBTUnentschuldigt?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "1_MitgliedPassivScore_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_Rollen": {
        Row: {
          AzureSync: boolean | null
          Beschreibung: string | null
          BewerbungOffen: boolean | null
          created_at: string
          Email: string | null
          GroupID: string | null
          ID: number
          KernTeam: boolean | null
          LegacyID: number | null
          ListIDHistory: string | null
          OrgChartZeigen: boolean | null
          RolleAktiv: boolean | null
          TeamsTeamID: string | null
          Titel: string | null
          VBBezug: number | null
          VorgesetzteRolle: number | null
        }
        Insert: {
          AzureSync?: boolean | null
          Beschreibung?: string | null
          BewerbungOffen?: boolean | null
          created_at?: string
          Email?: string | null
          GroupID?: string | null
          ID?: number
          KernTeam?: boolean | null
          LegacyID?: number | null
          ListIDHistory?: string | null
          OrgChartZeigen?: boolean | null
          RolleAktiv?: boolean | null
          TeamsTeamID?: string | null
          Titel?: string | null
          VBBezug?: number | null
          VorgesetzteRolle?: number | null
        }
        Update: {
          AzureSync?: boolean | null
          Beschreibung?: string | null
          BewerbungOffen?: boolean | null
          created_at?: string
          Email?: string | null
          GroupID?: string | null
          ID?: number
          KernTeam?: boolean | null
          LegacyID?: number | null
          ListIDHistory?: string | null
          OrgChartZeigen?: boolean | null
          RolleAktiv?: boolean | null
          TeamsTeamID?: string | null
          Titel?: string | null
          VBBezug?: number | null
          VorgesetzteRolle?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "1_Rollen_VBBezug_fkey"
            columns: ["VBBezug"]
            isOneToOne: false
            referencedRelation: "1_Rollen"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "1_Rollen_VorgesetzteRolle_fkey"
            columns: ["VorgesetzteRolle"]
            isOneToOne: false
            referencedRelation: "1_Rollen"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_RollenMitglieder": {
        Row: {
          BeginnDatum: string | null
          created_at: string
          EndeDatum: string | null
          ID: number
          LeitendeFunktion: boolean | null
          MitgliedID: number
          PrimaryRole: boolean | null
          RollenID: number
          Titel: string | null
        }
        Insert: {
          BeginnDatum?: string | null
          created_at?: string
          EndeDatum?: string | null
          ID?: number
          LeitendeFunktion?: boolean | null
          MitgliedID: number
          PrimaryRole?: boolean | null
          RollenID: number
          Titel?: string | null
        }
        Update: {
          BeginnDatum?: string | null
          created_at?: string
          EndeDatum?: string | null
          ID?: number
          LeitendeFunktion?: boolean | null
          MitgliedID?: number
          PrimaryRole?: boolean | null
          RollenID?: number
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "1_RollenMitglieder_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "1_RollenMitglieder_RollenID_fkey"
            columns: ["RollenID"]
            isOneToOne: false
            referencedRelation: "1_Rollen"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_TeamwahlBewerbungen": {
        Row: {
          Besetzt: boolean | null
          Bewerbungstext: string | null
          created_at: string
          ID: number
          MitgliedID: number | null
          PassivErklaerung: string | null
          Passivplaene: boolean | null
          Prioritaet: number | null
          RollenID: number | null
          Semester: string | null
          Teamleitung: boolean | null
          Titel: string | null
        }
        Insert: {
          Besetzt?: boolean | null
          Bewerbungstext?: string | null
          created_at?: string
          ID?: number
          MitgliedID?: number | null
          PassivErklaerung?: string | null
          Passivplaene?: boolean | null
          Prioritaet?: number | null
          RollenID?: number | null
          Semester?: string | null
          Teamleitung?: boolean | null
          Titel?: string | null
        }
        Update: {
          Besetzt?: boolean | null
          Bewerbungstext?: string | null
          created_at?: string
          ID?: number
          MitgliedID?: number | null
          PassivErklaerung?: string | null
          Passivplaene?: boolean | null
          Prioritaet?: number | null
          RollenID?: number | null
          Semester?: string | null
          Teamleitung?: boolean | null
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "1_TeamwahlBewerbungen_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "1_TeamwahlBewerbungen_RollenID_fkey"
            columns: ["RollenID"]
            isOneToOne: false
            referencedRelation: "1_Rollen"
            referencedColumns: ["ID"]
          },
        ]
      }
      "1_TeamwahlStatus": {
        Row: {
          created_at: string
          EndeDatum: string | null
          ID: number
          MitgliedID: number | null
          Semester: string | null
          Status: string | null
          Titel: string | null
        }
        Insert: {
          created_at?: string
          EndeDatum?: string | null
          ID?: number
          MitgliedID?: number | null
          Semester?: string | null
          Status?: string | null
          Titel?: string | null
        }
        Update: {
          created_at?: string
          EndeDatum?: string | null
          ID?: number
          MitgliedID?: number | null
          Semester?: string | null
          Status?: string | null
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "1_TeamwahlStatus_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
        ]
      }
      "3_JobboardAnzeigen": {
        Row: {
          AnzeigeAktivBis: string | null
          Bachelor: boolean | null
          Bewerbungsdeadline: string | null
          created_at: string
          Festeinstieg: boolean | null
          ID: number
          JobBeginn: string | null
          Master: boolean | null
          Titel: string | null
        }
        Insert: {
          AnzeigeAktivBis?: string | null
          Bachelor?: boolean | null
          Bewerbungsdeadline?: string | null
          created_at?: string
          Festeinstieg?: boolean | null
          ID?: number
          JobBeginn?: string | null
          Master?: boolean | null
          Titel?: string | null
        }
        Update: {
          AnzeigeAktivBis?: string | null
          Bachelor?: boolean | null
          Bewerbungsdeadline?: string | null
          created_at?: string
          Festeinstieg?: boolean | null
          ID?: number
          JobBeginn?: string | null
          Master?: boolean | null
          Titel?: string | null
        }
        Relationships: []
      }
      "4_EventBewerbungen": {
        Row: {
          Anwesend: boolean | null
          Besetzt: boolean | null
          BewerbungText: string | null
          created_at: string
          Essgewohnheiten: string | null
          EventID: number | null
          HSMScore: number | null
          ID: number
          MitgliedID: number | null
          SEPAMandat: boolean | null
          Titel: string | null
        }
        Insert: {
          Anwesend?: boolean | null
          Besetzt?: boolean | null
          BewerbungText?: string | null
          created_at?: string
          Essgewohnheiten?: string | null
          EventID?: number | null
          HSMScore?: number | null
          ID?: number
          MitgliedID?: number | null
          SEPAMandat?: boolean | null
          Titel?: string | null
        }
        Update: {
          Anwesend?: boolean | null
          Besetzt?: boolean | null
          BewerbungText?: string | null
          created_at?: string
          Essgewohnheiten?: string | null
          EventID?: number | null
          HSMScore?: number | null
          ID?: number
          MitgliedID?: number | null
          SEPAMandat?: boolean | null
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "4_EventBewerbungen_EventID_fkey"
            columns: ["EventID"]
            isOneToOne: false
            referencedRelation: "4_Events"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "4_EventBewerbungen_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
        ]
      }
      "4_EventMaster": {
        Row: {
          created_at: string
          Eventart: Database["public"]["Enums"]["Eventart"] | null
          ID: number
          MasterBeschreibung: string | null
          TeamsWorkspaceURL: string | null
          Titel: string | null
        }
        Insert: {
          created_at?: string
          Eventart?: Database["public"]["Enums"]["Eventart"] | null
          ID?: number
          MasterBeschreibung?: string | null
          TeamsWorkspaceURL?: string | null
          Titel?: string | null
        }
        Update: {
          created_at?: string
          Eventart?: Database["public"]["Enums"]["Eventart"] | null
          ID?: number
          MasterBeschreibung?: string | null
          TeamsWorkspaceURL?: string | null
          Titel?: string | null
        }
        Relationships: []
      }
      "4_Events": {
        Row: {
          AngabeEssgewGewuenscht: boolean | null
          AnlageGewuenscht: boolean | null
          AnlageInhalte: string | null
          Anmeldeart: Database["public"]["Enums"]["EventAnmeldeart"] | null
          Beginn: string | null
          Beschreibung: string | null
          Bewerbungsdeadline: string | null
          BewerbungstextGewuenscht: boolean | null
          BewTextVorgabe: string | null
          CheckInBeginn: string | null
          created_at: string
          Ende: string | null
          FCFSSlots: number | null
          HSMPoints: number | null
          ID: number
          IsVisible: boolean | null
          KostenEUR: number | null
          KostenString: string | null
          LinkOnlineDokument: string | null
          MasterEventID: number | null
          Ort: string | null
          Postleitzahl: string | null
          Semester: string | null
          StrasseHausnummer: string | null
          Titel: string | null
        }
        Insert: {
          AngabeEssgewGewuenscht?: boolean | null
          AnlageGewuenscht?: boolean | null
          AnlageInhalte?: string | null
          Anmeldeart?: Database["public"]["Enums"]["EventAnmeldeart"] | null
          Beginn?: string | null
          Beschreibung?: string | null
          Bewerbungsdeadline?: string | null
          BewerbungstextGewuenscht?: boolean | null
          BewTextVorgabe?: string | null
          CheckInBeginn?: string | null
          created_at?: string
          Ende?: string | null
          FCFSSlots?: number | null
          HSMPoints?: number | null
          ID?: number
          IsVisible?: boolean | null
          KostenEUR?: number | null
          KostenString?: string | null
          LinkOnlineDokument?: string | null
          MasterEventID?: number | null
          Ort?: string | null
          Postleitzahl?: string | null
          Semester?: string | null
          StrasseHausnummer?: string | null
          Titel?: string | null
        }
        Update: {
          AngabeEssgewGewuenscht?: boolean | null
          AnlageGewuenscht?: boolean | null
          AnlageInhalte?: string | null
          Anmeldeart?: Database["public"]["Enums"]["EventAnmeldeart"] | null
          Beginn?: string | null
          Beschreibung?: string | null
          Bewerbungsdeadline?: string | null
          BewerbungstextGewuenscht?: boolean | null
          BewTextVorgabe?: string | null
          CheckInBeginn?: string | null
          created_at?: string
          Ende?: string | null
          FCFSSlots?: number | null
          HSMPoints?: number | null
          ID?: number
          IsVisible?: boolean | null
          KostenEUR?: number | null
          KostenString?: string | null
          LinkOnlineDokument?: string | null
          MasterEventID?: number | null
          Ort?: string | null
          Postleitzahl?: string | null
          Semester?: string | null
          StrasseHausnummer?: string | null
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "4_Events_MasterEventID_fkey"
            columns: ["MasterEventID"]
            isOneToOne: false
            referencedRelation: "4_EventMaster"
            referencedColumns: ["ID"]
          },
        ]
      }
      "4_EventVerantwortliche": {
        Row: {
          Besetzt: boolean | null
          BewerbungText: string | null
          created_at: string
          Essgewohnheiten: string | null
          EventID: number | null
          ID: number
          MitgliedID: number | null
          Titel: string | null
        }
        Insert: {
          Besetzt?: boolean | null
          BewerbungText?: string | null
          created_at?: string
          Essgewohnheiten?: string | null
          EventID?: number | null
          ID?: number
          MitgliedID?: number | null
          Titel?: string | null
        }
        Update: {
          Besetzt?: boolean | null
          BewerbungText?: string | null
          created_at?: string
          Essgewohnheiten?: string | null
          EventID?: number | null
          ID?: number
          MitgliedID?: number | null
          Titel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "4_EventVerantwortliche_EventID_fkey"
            columns: ["EventID"]
            isOneToOne: false
            referencedRelation: "4_Events"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "4_EventVerantwortliche_MitgliedID_fkey"
            columns: ["MitgliedID"]
            isOneToOne: false
            referencedRelation: "1_Mitglieder"
            referencedColumns: ["ID"]
          },
        ]
      }
      gocardless_tokens: {
        Row: {
          access_token: string | null
          id: number
          refresh_token: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          id?: number
          refresh_token?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          id?: number
          refresh_token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kontobewegungen: {
        Row: {
          beguenstiger: string
          betrag: number
          buchungsdatum: string
          id: string
          konto: string
          verwendungszweck: string
        }
        Insert: {
          beguenstiger: string
          betrag: number
          buchungsdatum: string
          id: string
          konto: string
          verwendungszweck: string
        }
        Update: {
          beguenstiger?: string
          betrag?: number
          buchungsdatum?: string
          id?: string
          konto?: string
          verwendungszweck?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_event_application_count: {
        Args: { event_id: number }
        Returns: number
      }
      get_mitglied_id: { Args: never; Returns: number }
      get_user_oid: { Args: never; Returns: string }
      has_role: { Args: { roleid: number }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      Beraterstufe:
        | "Junior Consultant"
        | "Consultant"
        | "Senior Consultant"
        | "Managing Consultant"
        | "Director"
        | "Senior Director"
      EventAnmeldeart: "Bewerben" | "Einschreiben" | "FCFS"
      Eventart: "Netzwerk" | "Social" | "Kuratoren" | "HSM" | "Sonstiges"
      MitgliedsrolleAlumniAnwaerterMitglied: "Mitglied" | "Anwärter" | "Alumni"
      MitgliedsstatusAktivPassivEhemalig: "Aktiv" | "Passiv" | "Ehemalig"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Beraterstufe: [
        "Junior Consultant",
        "Consultant",
        "Senior Consultant",
        "Managing Consultant",
        "Director",
        "Senior Director",
      ],
      EventAnmeldeart: ["Bewerben", "Einschreiben", "FCFS"],
      Eventart: ["Netzwerk", "Social", "Kuratoren", "HSM", "Sonstiges"],
      MitgliedsrolleAlumniAnwaerterMitglied: ["Mitglied", "Anwärter", "Alumni"],
      MitgliedsstatusAktivPassivEhemalig: ["Aktiv", "Passiv", "Ehemalig"],
    },
  },
} as const
