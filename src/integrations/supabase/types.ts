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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      buyers: {
        Row: {
          address: string | null
          buyer_type: string
          created_at: string
          crops_buying: string[]
          district: string
          id: string
          logo_url: string | null
          name_bn: string
          name_en: string
          offered_price_note: string | null
          phone: string
          verified: boolean
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          buyer_type: string
          created_at?: string
          crops_buying?: string[]
          district: string
          id?: string
          logo_url?: string | null
          name_bn: string
          name_en: string
          offered_price_note?: string | null
          phone: string
          verified?: boolean
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          buyer_type?: string
          created_at?: string
          crops_buying?: string[]
          district?: string
          id?: string
          logo_url?: string | null
          name_bn?: string
          name_en?: string
          offered_price_note?: string | null
          phone?: string
          verified?: boolean
          whatsapp?: string | null
        }
        Relationships: []
      }
      crop_sales: {
        Row: {
          buyer_id: string | null
          created_at: string
          crop: string
          farmer_id: string
          id: string
          listing_id: string | null
          notes: string | null
          price_per_kg: number
          quantity_kg: number
          sale_date: string
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string
          crop: string
          farmer_id: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          price_per_kg: number
          quantity_kg: number
          sale_date?: string
        }
        Update: {
          buyer_id?: string | null
          created_at?: string
          crop?: string
          farmer_id?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          price_per_kg?: number
          quantity_kg?: number
          sale_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_sales_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_sales_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "farmer_crop_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      disease_questions: {
        Row: {
          answer: string | null
          answered_at: string | null
          created_at: string
          crop: string
          farmer_id: string
          id: string
          question: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          created_at?: string
          crop: string
          farmer_id: string
          id?: string
          question: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          created_at?: string
          crop?: string
          farmer_id?: string
          id?: string
          question?: string
        }
        Relationships: []
      }
      farmer_crop_listings: {
        Row: {
          area: string | null
          company_name: string | null
          contact_phone: string | null
          created_at: string
          crop: string
          description: string | null
          farmer_id: string
          id: string
          image_url: string | null
          price_per_unit: number
          quantity: number
          seller_type: string
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          company_name?: string | null
          contact_phone?: string | null
          created_at?: string
          crop: string
          description?: string | null
          farmer_id: string
          id?: string
          image_url?: string | null
          price_per_unit: number
          quantity: number
          seller_type?: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          company_name?: string | null
          contact_phone?: string | null
          created_at?: string
          crop?: string
          description?: string | null
          farmer_id?: string
          id?: string
          image_url?: string | null
          price_per_unit?: number
          quantity?: number
          seller_type?: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      helpline_tickets: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          phone: string
          problem: string
          replied_at: string | null
          reply: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          phone: string
          problem: string
          replied_at?: string | null
          reply?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          phone?: string
          problem?: string
          replied_at?: string | null
          reply?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      labor_profiles: {
        Row: {
          available: boolean
          categories: string[]
          created_at: string
          daily_rate: number
          description: string | null
          district: string
          division: string
          full_name: string
          id: string
          phone: string
          upazila: string
          updated_at: string
          user_id: string
          village: string
        }
        Insert: {
          available?: boolean
          categories?: string[]
          created_at?: string
          daily_rate: number
          description?: string | null
          district: string
          division: string
          full_name: string
          id?: string
          phone: string
          upazila: string
          updated_at?: string
          user_id: string
          village: string
        }
        Update: {
          available?: boolean
          categories?: string[]
          created_at?: string
          daily_rate?: number
          description?: string | null
          district?: string
          division?: string
          full_name?: string
          id?: string
          phone?: string
          upazila?: string
          updated_at?: string
          user_id?: string
          village?: string
        }
        Relationships: []
      }
      machine_bookings: {
        Row: {
          created_at: string
          end_date: string
          farmer_id: string
          id: string
          machine_id: string
          notes: string | null
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string
          end_date: string
          farmer_id: string
          id?: string
          machine_id: string
          notes?: string | null
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          farmer_id?: string
          id?: string
          machine_id?: string
          notes?: string | null
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          available: boolean
          available_from: string | null
          contact_phone: string
          created_at: string
          description: string | null
          district: string
          id: string
          image_url: string | null
          machine_type: string
          owner_id: string
          price_per_day: number | null
          price_per_hour: number | null
          rate_per_day: number
          title: string
          upazila: string | null
          updated_at: string
        }
        Insert: {
          available?: boolean
          available_from?: string | null
          contact_phone: string
          created_at?: string
          description?: string | null
          district: string
          id?: string
          image_url?: string | null
          machine_type: string
          owner_id: string
          price_per_day?: number | null
          price_per_hour?: number | null
          rate_per_day: number
          title: string
          upazila?: string | null
          updated_at?: string
        }
        Update: {
          available?: boolean
          available_from?: string | null
          contact_phone?: string
          created_at?: string
          description?: string | null
          district?: string
          id?: string
          image_url?: string | null
          machine_type?: string
          owner_id?: string
          price_per_day?: number | null
          price_per_hour?: number | null
          rate_per_day?: number
          title?: string
          upazila?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          created_at: string
          crop_bn: string
          crop_en: string
          id: string
          market_bn: string
          market_en: string
          price_date: string
          price_max: number
          price_min: number
          unit: string
        }
        Insert: {
          created_at?: string
          crop_bn: string
          crop_en: string
          id?: string
          market_bn: string
          market_en: string
          price_date?: string
          price_max: number
          price_min: number
          unit?: string
        }
        Update: {
          created_at?: string
          crop_bn?: string
          crop_en?: string
          id?: string
          market_bn?: string
          market_en?: string
          price_date?: string
          price_max?: number
          price_min?: number
          unit?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          listing_crop: string | null
          listing_id: string | null
          message: string
          read: boolean
          recipient_id: string
          sender_id: string
          sender_name: string | null
          sender_phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          listing_crop?: string | null
          listing_id?: string | null
          message: string
          read?: boolean
          recipient_id: string
          sender_id: string
          sender_name?: string | null
          sender_phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          listing_crop?: string | null
          listing_id?: string | null
          message?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
          sender_name?: string | null
          sender_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "farmer_crop_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          district: string | null
          division: string | null
          father_name: string | null
          full_name: string | null
          gender: string | null
          holding_number: string | null
          id: string
          irrigation_source: string | null
          krishi_card_no: string | null
          land_ownership: string | null
          land_size_acres: number | null
          land_type: string | null
          land_unit: string
          mother_name: string | null
          nid_address: string | null
          nid_name: string | null
          nid_number: string | null
          occupation: string | null
          phone: string | null
          post_office: string | null
          postal_code: string | null
          preferred_language: string
          primary_crops: string[] | null
          upazila: string | null
          updated_at: string
          village: string | null
          ward_no: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          district?: string | null
          division?: string | null
          father_name?: string | null
          full_name?: string | null
          gender?: string | null
          holding_number?: string | null
          id: string
          irrigation_source?: string | null
          krishi_card_no?: string | null
          land_ownership?: string | null
          land_size_acres?: number | null
          land_type?: string | null
          land_unit?: string
          mother_name?: string | null
          nid_address?: string | null
          nid_name?: string | null
          nid_number?: string | null
          occupation?: string | null
          phone?: string | null
          post_office?: string | null
          postal_code?: string | null
          preferred_language?: string
          primary_crops?: string[] | null
          upazila?: string | null
          updated_at?: string
          village?: string | null
          ward_no?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          district?: string | null
          division?: string | null
          father_name?: string | null
          full_name?: string | null
          gender?: string | null
          holding_number?: string | null
          id?: string
          irrigation_source?: string | null
          krishi_card_no?: string | null
          land_ownership?: string | null
          land_size_acres?: number | null
          land_type?: string | null
          land_unit?: string
          mother_name?: string | null
          nid_address?: string | null
          nid_name?: string | null
          nid_number?: string | null
          occupation?: string | null
          phone?: string | null
          post_office?: string | null
          postal_code?: string | null
          preferred_language?: string
          primary_crops?: string[] | null
          upazila?: string | null
          updated_at?: string
          village?: string | null
          ward_no?: string | null
        }
        Relationships: []
      }
      schemes: {
        Row: {
          category: string
          created_at: string
          description_bn: string
          description_en: string
          eligibility_bn: string | null
          eligibility_en: string | null
          id: string
          link: string | null
          ministry: string | null
          title_bn: string
          title_en: string
        }
        Insert: {
          category: string
          created_at?: string
          description_bn: string
          description_en: string
          eligibility_bn?: string | null
          eligibility_en?: string | null
          id?: string
          link?: string | null
          ministry?: string | null
          title_bn: string
          title_en: string
        }
        Update: {
          category?: string
          created_at?: string
          description_bn?: string
          description_en?: string
          eligibility_bn?: string | null
          eligibility_en?: string | null
          id?: string
          link?: string | null
          ministry?: string | null
          title_bn?: string
          title_en?: string
        }
        Relationships: []
      }
      smart_card_transactions: {
        Row: {
          amount: number
          card_id: string
          created_at: string
          id: string
          is_own_number: boolean | null
          note: string | null
          payment_method: string | null
          payment_number: string | null
          request_birthdate: string | null
          request_name: string | null
          request_nid: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          card_id: string
          created_at?: string
          id?: string
          is_own_number?: boolean | null
          note?: string | null
          payment_method?: string | null
          payment_number?: string | null
          request_birthdate?: string | null
          request_name?: string | null
          request_nid?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          card_id?: string
          created_at?: string
          id?: string
          is_own_number?: boolean | null
          note?: string | null
          payment_method?: string | null
          payment_number?: string | null
          request_birthdate?: string | null
          request_name?: string | null
          request_nid?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_card_transactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "smart_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_cards: {
        Row: {
          balance: number
          card_number: string
          created_at: string
          expires_at: string
          id: string
          issued_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          card_number: string
          created_at?: string
          expires_at?: string
          id?: string
          issued_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          card_number?: string
          created_at?: string
          expires_at?: string
          id?: string
          issued_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tips: {
        Row: {
          category: string
          content_bn: string
          content_en: string
          created_at: string
          id: string
          image_url: string | null
          title_bn: string
          title_en: string
        }
        Insert: {
          category: string
          content_bn: string
          content_en: string
          created_at?: string
          id?: string
          image_url?: string | null
          title_bn: string
          title_en: string
        }
        Update: {
          category?: string
          content_bn?: string
          content_en?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title_bn?: string
          title_en?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_seller_profiles: {
        Row: {
          avatar_url: string | null
          district: string | null
          full_name: string | null
          id: string | null
          phone: string | null
          village: string | null
        }
        Insert: {
          avatar_url?: string | null
          district?: string | null
          full_name?: string | null
          id?: string | null
          phone?: string | null
          village?: string | null
        }
        Update: {
          avatar_url?: string | null
          district?: string | null
          full_name?: string | null
          id?: string | null
          phone?: string | null
          village?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
