export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_name: string;
          quantity: number;
          unit_price_cents: number;
          variant_id: string | null;
          variant_label: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_name: string;
          quantity: number;
          unit_price_cents: number;
          variant_id?: string | null;
          variant_label: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price_cents?: number;
          variant_id?: string | null;
          variant_label?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      order_status_history: {
        Row: {
          changed_by: string | null;
          created_at: string;
          field: string;
          id: string;
          order_id: string;
          value: string;
        };
        Insert: {
          changed_by?: string | null;
          created_at?: string;
          field: string;
          id?: string;
          order_id: string;
          value: string;
        };
        Update: {
          changed_by?: string | null;
          created_at?: string;
          field?: string;
          id?: string;
          order_id?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          access_token: string;
          address: string | null;
          admin_notes: string | null;
          city: string | null;
          created_at: string;
          currency: string;
          customer_name: string;
          customer_note: string | null;
          delivery_fee_cents: number;
          delivery_instructions: string | null;
          email: string | null;
          fulfillment: string;
          id: string;
          idempotency_key: string | null;
          order_number: string;
          payment_method: string;
          payment_status: string;
          phone: string;
          status: string;
          subtotal_cents: number;
          total_cents: number;
          updated_at: string;
        };
        Insert: {
          access_token?: string;
          address?: string | null;
          admin_notes?: string | null;
          city?: string | null;
          created_at?: string;
          currency: string;
          customer_name: string;
          customer_note?: string | null;
          delivery_fee_cents?: number;
          delivery_instructions?: string | null;
          email?: string | null;
          fulfillment: string;
          id?: string;
          idempotency_key?: string | null;
          order_number: string;
          payment_method?: string;
          payment_status?: string;
          phone: string;
          status?: string;
          subtotal_cents: number;
          total_cents: number;
          updated_at?: string;
        };
        Update: {
          access_token?: string;
          address?: string | null;
          admin_notes?: string | null;
          city?: string | null;
          created_at?: string;
          currency?: string;
          customer_name?: string;
          customer_note?: string | null;
          delivery_fee_cents?: number;
          delivery_instructions?: string | null;
          email?: string | null;
          fulfillment?: string;
          id?: string;
          idempotency_key?: string | null;
          order_number?: string;
          payment_method?: string;
          payment_status?: string;
          phone?: string;
          status?: string;
          subtotal_cents?: number;
          total_cents?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          is_available: boolean;
          label: string;
          price_cents: number;
          product_id: string;
          sort_order: number;
          stock: number;
        };
        Insert: {
          id?: string;
          is_available?: boolean;
          label: string;
          price_cents: number;
          product_id: string;
          sort_order?: number;
          stock?: number;
        };
        Update: {
          id?: string;
          is_available?: boolean;
          label?: string;
          price_cents?: number;
          product_id?: string;
          sort_order?: number;
          stock?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          allergens: string | null;
          category_id: string | null;
          created_at: string;
          description: string;
          id: string;
          image_url: string | null;
          ingredients: string | null;
          is_featured: boolean;
          is_published: boolean;
          name: string;
          short_description: string;
          slug: string;
          sort_order: number;
          storage_instructions: string | null;
          texture: string | null;
          updated_at: string;
        };
        Insert: {
          allergens?: string | null;
          category_id?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          image_url?: string | null;
          ingredients?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          name: string;
          short_description?: string;
          slug: string;
          sort_order?: number;
          storage_instructions?: string | null;
          texture?: string | null;
          updated_at?: string;
        };
        Update: {
          allergens?: string | null;
          category_id?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          image_url?: string | null;
          ingredients?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          name?: string;
          short_description?: string;
          slug?: string;
          sort_order?: number;
          storage_instructions?: string | null;
          texture?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          address: string | null;
          announcement: string;
          business_name: string;
          country: string;
          currency: string;
          delivery_enabled: boolean;
          delivery_fee_cents: number;
          delivery_info: string;
          delivery_regions: string | null;
          email: string | null;
          id: number;
          instagram_url: string | null;
          phone: string | null;
          pickup_enabled: boolean;
          pickup_instructions: string | null;
          pickup_location: string | null;
          story: string;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          announcement?: string;
          business_name?: string;
          country?: string;
          currency?: string;
          delivery_enabled?: boolean;
          delivery_fee_cents?: number;
          delivery_info?: string;
          delivery_regions?: string | null;
          email?: string | null;
          id?: number;
          instagram_url?: string | null;
          phone?: string | null;
          pickup_enabled?: boolean;
          pickup_instructions?: string | null;
          pickup_location?: string | null;
          story?: string;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          announcement?: string;
          business_name?: string;
          country?: string;
          currency?: string;
          delivery_enabled?: boolean;
          delivery_fee_cents?: number;
          delivery_info?: string;
          delivery_regions?: string | null;
          email?: string | null;
          id?: number;
          instagram_url?: string | null;
          phone?: string | null;
          pickup_enabled?: boolean;
          pickup_instructions?: string | null;
          pickup_location?: string | null;
          story?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_order_public: {
        Args: { _order_number: string; _token: string };
        Returns: Json;
      };
      admin_update_order: {
        Args: {
          _admin_notes?: string | null;
          _order_id: string;
          _payment_status?: string | null;
          _status?: string | null;
          _update_notes?: boolean;
        };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      place_order: { Args: { payload: Json }; Returns: Json };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
