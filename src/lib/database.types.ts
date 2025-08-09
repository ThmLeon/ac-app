export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
          AngabeEssgewGewuenscht: string | null
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
          AngabeEssgewGewuenscht?: string | null
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
          AngabeEssgewGewuenscht?: string | null
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
      [_ in never]: never
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
