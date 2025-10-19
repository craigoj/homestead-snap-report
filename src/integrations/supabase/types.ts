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
      api_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          expires_at: string
          id: string
          response_data: Json
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          expires_at: string
          id?: string
          response_data: Json
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          response_data?: Json
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          request_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      assessment_submissions: {
        Row: {
          admin_notes: string | null
          contacted_at: string | null
          contacted_by: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          priority_level: number
          responses: Json
          score: number
          segment: string
          status: string | null
          submitted_at: string
        }
        Insert: {
          admin_notes?: string | null
          contacted_at?: string | null
          contacted_by?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          location?: string | null
          phone?: string | null
          priority_level: number
          responses?: Json
          score: number
          segment: string
          status?: string | null
          submitted_at?: string
        }
        Update: {
          admin_notes?: string | null
          contacted_at?: string | null
          contacted_by?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          priority_level?: number
          responses?: Json
          score?: number
          segment?: string
          status?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      asset_photos: {
        Row: {
          asset_id: string
          camera_make: string | null
          camera_model: string | null
          created_at: string
          exif_data: Json | null
          file_name: string
          file_path: string
          file_size: number | null
          gps_coordinates: Json | null
          id: string
          is_primary: boolean | null
          original_filename: string | null
          photo_hash: string | null
          photo_taken_at: string | null
        }
        Insert: {
          asset_id: string
          camera_make?: string | null
          camera_model?: string | null
          created_at?: string
          exif_data?: Json | null
          file_name: string
          file_path: string
          file_size?: number | null
          gps_coordinates?: Json | null
          id?: string
          is_primary?: boolean | null
          original_filename?: string | null
          photo_hash?: string | null
          photo_taken_at?: string | null
        }
        Update: {
          asset_id?: string
          camera_make?: string | null
          camera_model?: string | null
          created_at?: string
          exif_data?: Json | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          gps_coordinates?: Json | null
          id?: string
          is_primary?: boolean | null
          original_filename?: string | null
          photo_hash?: string | null
          photo_taken_at?: string | null
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
      asset_versions: {
        Row: {
          asset_id: string
          changed_at: string
          changed_by: string
          changes: Json
          id: string
          reason: string | null
          snapshot: Json
          user_id: string
          version_number: number
        }
        Insert: {
          asset_id: string
          changed_at?: string
          changed_by: string
          changes: Json
          id?: string
          reason?: string | null
          snapshot: Json
          user_id: string
          version_number: number
        }
        Update: {
          asset_id?: string
          changed_at?: string
          changed_by?: string
          changes?: Json
          id?: string
          reason?: string | null
          snapshot?: Json
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "asset_versions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          appraisal_date: string | null
          appraisal_document_path: string | null
          appraisal_value: number | null
          appraiser_name: string | null
          barcode_data: string | null
          brand: string | null
          category: Database["public"]["Enums"]["asset_category"]
          condition: Database["public"]["Enums"]["asset_condition"]
          created_at: string
          description: string | null
          device_specifications: Json | null
          ebay_epid: string | null
          ebay_valuation_id: string | null
          equipment_type: Json | null
          estimated_value: number | null
          gtin: string | null
          id: string
          is_high_value: boolean | null
          model: string | null
          ocr_confidence: number | null
          ocr_extracted: boolean | null
          ocr_metadata: Json | null
          ocr_provider: string | null
          ocr_raw_text: string | null
          property_id: string
          purchase_date: string | null
          purchase_price: number | null
          qr_code_data: string | null
          requires_appraisal: boolean | null
          room_id: string | null
          serial_number: string | null
          title: string
          upc: string | null
          updated_at: string
          user_id: string
          valuation_data_source: string | null
          valuation_last_updated: string | null
        }
        Insert: {
          appraisal_date?: string | null
          appraisal_document_path?: string | null
          appraisal_value?: number | null
          appraiser_name?: string | null
          barcode_data?: string | null
          brand?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          condition?: Database["public"]["Enums"]["asset_condition"]
          created_at?: string
          description?: string | null
          device_specifications?: Json | null
          ebay_epid?: string | null
          ebay_valuation_id?: string | null
          equipment_type?: Json | null
          estimated_value?: number | null
          gtin?: string | null
          id?: string
          is_high_value?: boolean | null
          model?: string | null
          ocr_confidence?: number | null
          ocr_extracted?: boolean | null
          ocr_metadata?: Json | null
          ocr_provider?: string | null
          ocr_raw_text?: string | null
          property_id: string
          purchase_date?: string | null
          purchase_price?: number | null
          qr_code_data?: string | null
          requires_appraisal?: boolean | null
          room_id?: string | null
          serial_number?: string | null
          title: string
          upc?: string | null
          updated_at?: string
          user_id: string
          valuation_data_source?: string | null
          valuation_last_updated?: string | null
        }
        Update: {
          appraisal_date?: string | null
          appraisal_document_path?: string | null
          appraisal_value?: number | null
          appraiser_name?: string | null
          barcode_data?: string | null
          brand?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          condition?: Database["public"]["Enums"]["asset_condition"]
          created_at?: string
          description?: string | null
          device_specifications?: Json | null
          ebay_epid?: string | null
          ebay_valuation_id?: string | null
          equipment_type?: Json | null
          estimated_value?: number | null
          gtin?: string | null
          id?: string
          is_high_value?: boolean | null
          model?: string | null
          ocr_confidence?: number | null
          ocr_extracted?: boolean | null
          ocr_metadata?: Json | null
          ocr_provider?: string | null
          ocr_raw_text?: string | null
          property_id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          qr_code_data?: string | null
          requires_appraisal?: boolean | null
          room_id?: string | null
          serial_number?: string | null
          title?: string
          upc?: string | null
          updated_at?: string
          user_id?: string
          valuation_data_source?: string | null
          valuation_last_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_ebay_valuation_id_fkey"
            columns: ["ebay_valuation_id"]
            isOneToOne: false
            referencedRelation: "ebay_valuations"
            referencedColumns: ["id"]
          },
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
      ebay_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          id: string
          token_type: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          id?: string
          token_type: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          token_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ebay_valuations: {
        Row: {
          asset_id: string | null
          confidence_score: number | null
          created_at: string | null
          data_source: string | null
          ebay_data: Json | null
          estimated_value: number | null
          id: string
          market_trend: string | null
          reasoning: string | null
          search_method: string | null
          search_query: string | null
          user_id: string | null
          value_range_max: number | null
          value_range_min: number | null
        }
        Insert: {
          asset_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_source?: string | null
          ebay_data?: Json | null
          estimated_value?: number | null
          id?: string
          market_trend?: string | null
          reasoning?: string | null
          search_method?: string | null
          search_query?: string | null
          user_id?: string | null
          value_range_max?: number | null
          value_range_min?: number | null
        }
        Update: {
          asset_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_source?: string | null
          ebay_data?: Json | null
          estimated_value?: number | null
          id?: string
          market_trend?: string | null
          reasoning?: string | null
          search_method?: string | null
          search_query?: string | null
          user_id?: string | null
          value_range_max?: number | null
          value_range_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ebay_valuations_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_templates: {
        Row: {
          brand_patterns: string[] | null
          category: string
          common_models: string[] | null
          created_at: string
          depreciation_rate: number | null
          equipment_name: string
          id: string
          ocr_hints: Json | null
          serial_number_patterns: string[] | null
          subcategory: string | null
          typical_value_range: unknown | null
          updated_at: string
        }
        Insert: {
          brand_patterns?: string[] | null
          category: string
          common_models?: string[] | null
          created_at?: string
          depreciation_rate?: number | null
          equipment_name: string
          id?: string
          ocr_hints?: Json | null
          serial_number_patterns?: string[] | null
          subcategory?: string | null
          typical_value_range?: unknown | null
          updated_at?: string
        }
        Update: {
          brand_patterns?: string[] | null
          category?: string
          common_models?: string[] | null
          created_at?: string
          depreciation_rate?: number | null
          equipment_name?: string
          id?: string
          ocr_hints?: Json | null
          serial_number_patterns?: string[] | null
          subcategory?: string | null
          typical_value_range?: unknown | null
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          correlation_id: string | null
          created_at: string
          endpoint: string | null
          error_context: Json | null
          error_message: string | null
          error_type: string
          id: string
          resolved_at: string | null
          response_time_ms: number | null
          retry_count: number | null
          user_id: string | null
        }
        Insert: {
          correlation_id?: string | null
          created_at?: string
          endpoint?: string | null
          error_context?: Json | null
          error_message?: string | null
          error_type: string
          id?: string
          resolved_at?: string | null
          response_time_ms?: number | null
          retry_count?: number | null
          user_id?: string | null
        }
        Update: {
          correlation_id?: string | null
          created_at?: string
          endpoint?: string | null
          error_context?: Json | null
          error_message?: string | null
          error_type?: string
          id?: string
          resolved_at?: string | null
          response_time_ms?: number | null
          retry_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      loss_events: {
        Row: {
          created_at: string
          deadline_60_days: string | null
          deadline_notified: boolean | null
          description: string
          discovery_date: string
          estimated_total_loss: number | null
          event_date: string
          event_type: string
          fire_department_report: string | null
          id: string
          police_report_number: string | null
          property_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline_60_days?: string | null
          deadline_notified?: boolean | null
          description: string
          discovery_date: string
          estimated_total_loss?: number | null
          event_date: string
          event_type: string
          fire_department_report?: string | null
          id?: string
          police_report_number?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline_60_days?: string | null
          deadline_notified?: boolean | null
          description?: string
          discovery_date?: string
          estimated_total_loss?: number | null
          event_date?: string
          event_type?: string
          fire_department_report?: string | null
          id?: string
          police_report_number?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loss_events_property_id_fkey"
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
      proof_of_loss_forms: {
        Row: {
          claim_number: string | null
          created_at: string
          form_data: Json
          id: string
          insurer_name: string | null
          loss_event_id: string | null
          notary_info: Json | null
          policy_number: string | null
          signature_data: string | null
          signature_date: string | null
          status: string | null
          submitted_at: string | null
          sworn_statement_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          claim_number?: string | null
          created_at?: string
          form_data: Json
          id?: string
          insurer_name?: string | null
          loss_event_id?: string | null
          notary_info?: Json | null
          policy_number?: string | null
          signature_data?: string | null
          signature_date?: string | null
          status?: string | null
          submitted_at?: string | null
          sworn_statement_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          claim_number?: string | null
          created_at?: string
          form_data?: Json
          id?: string
          insurer_name?: string | null
          loss_event_id?: string | null
          notary_info?: Json | null
          policy_number?: string | null
          signature_data?: string | null
          signature_date?: string | null
          status?: string | null
          submitted_at?: string | null
          sworn_statement_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proof_of_loss_forms_loss_event_id_fkey"
            columns: ["loss_event_id"]
            isOneToOne: false
            referencedRelation: "loss_events"
            referencedColumns: ["id"]
          },
        ]
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
      report_templates: {
        Row: {
          created_at: string
          id: string
          insurer_name: string | null
          is_default: boolean | null
          template_config: Json
          template_name: string
          template_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          insurer_name?: string | null
          is_default?: boolean | null
          template_config: Json
          template_name: string
          template_type: string
        }
        Update: {
          created_at?: string
          id?: string
          insurer_name?: string | null
          is_default?: boolean | null
          template_config?: Json
          template_name?: string
          template_type?: string
        }
        Relationships: []
      }
      room_walkthroughs: {
        Row: {
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          linked_asset_ids: string[] | null
          property_id: string
          recorded_at: string | null
          room_id: string | null
          thumbnail_path: string | null
          user_id: string
          video_filename: string
          video_path: string
          video_size: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          linked_asset_ids?: string[] | null
          property_id: string
          recorded_at?: string | null
          room_id?: string | null
          thumbnail_path?: string | null
          user_id: string
          video_filename: string
          video_path: string
          video_size?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          linked_asset_ids?: string[] | null
          property_id?: string
          recorded_at?: string | null
          room_id?: string | null
          thumbnail_path?: string | null
          user_id?: string
          video_filename?: string
          video_path?: string
          video_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_walkthroughs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_walkthroughs_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          assessment_id: string | null
          email: string
          id: string
          joined_at: string
          notes: string | null
          notified: boolean | null
          position: number
          priority_tier: string
          status: string | null
        }
        Insert: {
          assessment_id?: string | null
          email: string
          id?: string
          joined_at?: string
          notes?: string | null
          notified?: boolean | null
          position?: number
          priority_tier: string
          status?: string | null
        }
        Update: {
          assessment_id?: string | null
          email?: string
          id?: string
          joined_at?: string
          notes?: string | null
          notified?: boolean | null
          position?: number
          priority_tier?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_valid_ebay_token: {
        Args: Record<PropertyKey, never>
        Returns: {
          access_token: string
          expires_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_entity_id?: string
          p_entity_type?: string
          p_event_type: Database["public"]["Enums"]["event_type"]
          p_metadata?: Json
        }
        Returns: string
      }
      should_revalue_asset: {
        Args: { p_asset_id: string }
        Returns: boolean
      }
      upsert_ebay_token: {
        Args: {
          p_access_token: string
          p_expires_at: string
          p_token_type: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
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
