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
          Art: string | null
          Aufnahmedatum: string | null
          AusnahmeMVs: boolean | null
          AzureSync: boolean | null
          Beraterstufe: string | null
          BIC: string | null
          CollmexID: number | null
          created_at: string
          EmailAC: string | null
          EmailPrivat: string | null
          Erstellt: string | null
          "Erstellt von": string | null
          Geändert: string | null
          "Geändert von": string | null
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
          Rolle: string | null
          Rueckkehrdatum: string | null
          Stadt: string | null
          Steuernummer: string | null
          Strasse: string | null
          Traineegeneration: string | null
          TransponderID: number | null
          UserID: string | null
          Vorname: string | null
          Weiblich: boolean | null
        }
        Insert: {
          Anwaertergeneration?: string | null
          Art?: string | null
          Aufnahmedatum?: string | null
          AusnahmeMVs?: boolean | null
          AzureSync?: boolean | null
          Beraterstufe?: string | null
          BIC?: string | null
          CollmexID?: number | null
          created_at?: string
          EmailAC?: string | null
          EmailPrivat?: string | null
          Erstellt?: string | null
          "Erstellt von"?: string | null
          Geändert?: string | null
          "Geändert von"?: string | null
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
          Rolle?: string | null
          Rueckkehrdatum?: string | null
          Stadt?: string | null
          Steuernummer?: string | null
          Strasse?: string | null
          Traineegeneration?: string | null
          TransponderID?: number | null
          UserID?: string | null
          Vorname?: string | null
          Weiblich?: boolean | null
        }
        Update: {
          Anwaertergeneration?: string | null
          Art?: string | null
          Aufnahmedatum?: string | null
          AusnahmeMVs?: boolean | null
          AzureSync?: boolean | null
          Beraterstufe?: string | null
          BIC?: string | null
          CollmexID?: number | null
          created_at?: string
          EmailAC?: string | null
          EmailPrivat?: string | null
          Erstellt?: string | null
          "Erstellt von"?: string | null
          Geändert?: string | null
          "Geändert von"?: string | null
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
          Rolle?: string | null
          Rueckkehrdatum?: string | null
          Stadt?: string | null
          Steuernummer?: string | null
          Strasse?: string | null
          Traineegeneration?: string | null
          TransponderID?: number | null
          UserID?: string | null
          Vorname?: string | null
          Weiblich?: boolean | null
        }
        Relationships: []
      }
      "4_EventMaster": {
        Row: {
          created_at: string
          Eventart: Database["public"]["Enums"]["eventart"] | null
          id: number
          MasterBeschreibung: string | null
          TeamsWorkspaceURL: string | null
          Titel: string | null
        }
        Insert: {
          created_at?: string
          Eventart?: Database["public"]["Enums"]["eventart"] | null
          id?: number
          MasterBeschreibung?: string | null
          TeamsWorkspaceURL?: string | null
          Titel?: string | null
        }
        Update: {
          created_at?: string
          Eventart?: Database["public"]["Enums"]["eventart"] | null
          id?: number
          MasterBeschreibung?: string | null
          TeamsWorkspaceURL?: string | null
          Titel?: string | null
        }
        Relationships: []
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
      eventart: "Netzwerk" | "Social" | "Kuratoren" | "HSM" | "Sonstiges"
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
      eventart: ["Netzwerk", "Social", "Kuratoren", "HSM", "Sonstiges"],
    },
  },
} as const
