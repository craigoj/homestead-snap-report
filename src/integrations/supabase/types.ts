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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      asset_photos: {
        Row: {
          asset_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_primary: boolean | null
        }
        Insert: {
          asset_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_primary?: boolean | null
        }
        Update: {
          asset_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_photos_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          brand: string | null
          category: Database["public"]["Enums"]["asset_category"]
          condition: Database["public"]["Enums"]["asset_condition"]
          created_at: string
          description: string | null
          estimated_value: number | null
          id: string
          model: string | null
          ocr_confidence: number | null
          ocr_extracted: boolean | null
          property_id: string
          purchase_date: string | null
          purchase_price: number | null
          room_id: string | null
          serial_number: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          condition?: Database["public"]["Enums"]["asset_condition"]
          created_at?: string
          description?: string | null
          estimated_value?: number | null
          id?: string
          model?: string | null
          ocr_confidence?: number | null
          ocr_extracted?: boolean | null
          property_id: string
          purchase_date?: string | null
          purchase_price?: number | null
          room_id?: string | null
          serial_number?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          condition?: Database["public"]["Enums"]["asset_condition"]
          created_at?: string
          description?: string | null
          estimated_value?: number | null
          id?: string
          model?: string | null
          ocr_confidence?: number | null
          ocr_extracted?: boolean | null
          property_id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          room_id?: string | null
          serial_number?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      claim_reports: {
        Row: {
          asset_count: number | null
          created_at: string
          expires_at: string | null
          file_path: string | null
          id: string
          property_id: string | null
          report_type: string
          share_token: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          title: string
          total_value: number | null
          user_id: string
        }
        Insert: {
          asset_count?: number | null
          created_at?: string
          expires_at?: string | null
          file_path?: string | null
          id?: string
          property_id?: string | null
          report_type?: string
          share_token?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          title: string
          total_value?: number | null
          user_id: string
        }
        Update: {
          asset_count?: number | null
          created_at?: string
          expires_at?: string | null
          file_path?: string | null
          id?: string
          property_id?: string | null
          report_type?: string
          share_token?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          title?: string
          total_value?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_reports_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          asset_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          property_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          property_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_audit_event: {
        Args: {
          p_entity_id?: string
          p_entity_type?: string
          p_event_type: Database["public"]["Enums"]["event_type"]
          p_metadata?: Json
        }
        Returns: string
      }
    }
    Enums: {
      asset_category:
        | "electronics"
        | "furniture"
        | "appliances"
        | "jewelry"
        | "clothing"
        | "art"
        | "books"
        | "tools"
        | "sports"
        | "other"
      asset_condition: "excellent" | "good" | "fair" | "poor"
      event_type:
        | "asset_created"
        | "ocr_success"
        | "ocr_fail"
        | "export_generated"
        | "user_signup"
        | "property_created"
      report_status: "generating" | "ready" | "expired" | "failed"
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
      asset_category: [
        "electronics",
        "furniture",
        "appliances",
        "jewelry",
        "clothing",
        "art",
        "books",
        "tools",
        "sports",
        "other",
      ],
      asset_condition: ["excellent", "good", "fair", "poor"],
      event_type: [
        "asset_created",
        "ocr_success",
        "ocr_fail",
        "export_generated",
        "user_signup",
        "property_created",
      ],
      report_status: ["generating", "ready", "expired", "failed"],
    },
  },
} as const
