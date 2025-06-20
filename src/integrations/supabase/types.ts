export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string | null
          currentcompany: string
          currentctc: string | null
          currentdesignation: string | null
          currenttakehome: string | null
          department: string
          email: string
          expectedctc: string
          fullname: string
          id: string
          job_id: string | null
          location: string
          noticeperiod: string | null
          otherdepartment: string | null
          phone: string
          processed: boolean | null
          resume_url: string | null
          yearsofexperience: string
        }
        Insert: {
          created_at?: string | null
          currentcompany: string
          currentctc?: string | null
          currentdesignation?: string | null
          currenttakehome?: string | null
          department: string
          email: string
          expectedctc: string
          fullname: string
          id?: string
          job_id?: string | null
          location: string
          noticeperiod?: string | null
          otherdepartment?: string | null
          phone: string
          processed?: boolean | null
          resume_url?: string | null
          yearsofexperience: string
        }
        Update: {
          created_at?: string | null
          currentcompany?: string
          currentctc?: string | null
          currentdesignation?: string | null
          currenttakehome?: string | null
          department?: string
          email?: string
          expectedctc?: string
          fullname?: string
          id?: string
          job_id?: string | null
          location?: string
          noticeperiod?: string | null
          otherdepartment?: string | null
          phone?: string
          processed?: boolean | null
          resume_url?: string | null
          yearsofexperience?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      general_profiles: {
        Row: {
          created_at: string | null
          currentcompany: string
          currentctc: string | null
          currentdesignation: string | null
          currenttakehome: string | null
          department: string
          email: string
          expectedctc: string
          fullname: string
          id: string
          location: string
          noticeperiod: string | null
          otherdepartment: string | null
          phone: string
          processed: boolean | null
          resume_url: string | null
          updated_at: string | null
          yearsofexperience: string
        }
        Insert: {
          created_at?: string | null
          currentcompany: string
          currentctc?: string | null
          currentdesignation?: string | null
          currenttakehome?: string | null
          department: string
          email: string
          expectedctc: string
          fullname: string
          id?: string
          location: string
          noticeperiod?: string | null
          otherdepartment?: string | null
          phone: string
          processed?: boolean | null
          resume_url?: string | null
          updated_at?: string | null
          yearsofexperience: string
        }
        Update: {
          created_at?: string | null
          currentcompany?: string
          currentctc?: string | null
          currentdesignation?: string | null
          currenttakehome?: string | null
          department?: string
          email?: string
          expectedctc?: string
          fullname?: string
          id?: string
          location?: string
          noticeperiod?: string | null
          otherdepartment?: string | null
          phone?: string
          processed?: boolean | null
          resume_url?: string | null
          updated_at?: string | null
          yearsofexperience?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          ctc: string | null
          dateposted: string | null
          description: string
          experience: string
          gender: string | null
          id: string
          industry: string
          jobId: string | null
          keyskills: string[]
          location: string
          position: string
          status: string
          user_id: string | null
        }
        Insert: {
          ctc?: string | null
          dateposted?: string | null
          description: string
          experience: string
          gender?: string | null
          id?: string
          industry: string
          jobId?: string | null
          keyskills: string[]
          location: string
          position: string
          status?: string
          user_id?: string | null
        }
        Update: {
          ctc?: string | null
          dateposted?: string | null
          description?: string
          experience?: string
          gender?: string | null
          id?: string
          industry?: string
          jobId?: string | null
          keyskills?: string[]
          location?: string
          position?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          city: string
          created_at: string | null
          id: string
          state: string
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          state: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          state?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          updated_at?: string | null
          webhook_url?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
