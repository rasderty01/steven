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
      Budget: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["BudgetCategory"]
          createdAt: string
          eventId: number | null
          id: number
          updatedAt: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["BudgetCategory"]
          createdAt?: string
          eventId?: number | null
          id?: number
          updatedAt?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["BudgetCategory"]
          createdAt?: string
          eventId?: number | null
          id?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Budget_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      EmailTemplate: {
        Row: {
          body: string
          createdAt: string
          eventId: number | null
          id: number
          name: string
          orgId: number | null
          subject: string
          updatedAt: string
        }
        Insert: {
          body: string
          createdAt?: string
          eventId?: number | null
          id?: never
          name: string
          orgId?: number | null
          subject: string
          updatedAt?: string
        }
        Update: {
          body?: string
          createdAt?: string
          eventId?: number | null
          id?: never
          name?: string
          orgId?: number | null
          subject?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "EmailTemplate_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EmailTemplate_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      Event: {
        Row: {
          createdAt: string
          description: string
          endTime: string
          eventCode: string | null
          guestLimit: number | null
          id: number
          imageUrl: string | null
          is_deleted: boolean
          isVirtual: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          orgId: number | null
          publish: boolean | null
          seatingPlanId: number | null
          startTime: string
          status: Database["public"]["Enums"]["EventStatus"]
          styling: Json | null
          title: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          description: string
          endTime: string
          eventCode?: string | null
          guestLimit?: number | null
          id?: number
          imageUrl?: string | null
          is_deleted?: boolean
          isVirtual?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          orgId?: number | null
          publish?: boolean | null
          seatingPlanId?: number | null
          startTime: string
          status?: Database["public"]["Enums"]["EventStatus"]
          styling?: Json | null
          title: string
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          description?: string
          endTime?: string
          eventCode?: string | null
          guestLimit?: number | null
          id?: number
          imageUrl?: string | null
          is_deleted?: boolean
          isVirtual?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          orgId?: number | null
          publish?: boolean | null
          seatingPlanId?: number | null
          startTime?: string
          status?: Database["public"]["Enums"]["EventStatus"]
          styling?: Json | null
          title?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Event_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Event_seatingPlanId_fkey"
            columns: ["seatingPlanId"]
            isOneToOne: false
            referencedRelation: "SeatingPlan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Event_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      EventSupplier: {
        Row: {
          agreedRate: number
          createdAt: string
          endTime: string
          eventId: number
          id: number
          notes: string | null
          startTime: string
          status: Database["public"]["Enums"]["SupplierStatus"]
          supplierId: number
          supplierServiceId: number
          updatedAt: string
        }
        Insert: {
          agreedRate: number
          createdAt?: string
          endTime: string
          eventId: number
          id?: number
          notes?: string | null
          startTime: string
          status?: Database["public"]["Enums"]["SupplierStatus"]
          supplierId: number
          supplierServiceId: number
          updatedAt?: string
        }
        Update: {
          agreedRate?: number
          createdAt?: string
          endTime?: string
          eventId?: number
          id?: number
          notes?: string | null
          startTime?: string
          status?: Database["public"]["Enums"]["SupplierStatus"]
          supplierId?: number
          supplierServiceId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventSupplier_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventSupplier_supplierId_fkey"
            columns: ["supplierId"]
            isOneToOne: false
            referencedRelation: "Supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventSupplier_supplierServiceId_fkey"
            columns: ["supplierServiceId"]
            isOneToOne: false
            referencedRelation: "SupplierService"
            referencedColumns: ["id"]
          },
        ]
      }
      Expense: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["BudgetCategory"]
          createdAt: string
          date: string
          description: string
          eventId: number | null
          id: number
          updatedAt: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["BudgetCategory"]
          createdAt?: string
          date: string
          description: string
          eventId?: number | null
          id?: number
          updatedAt?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["BudgetCategory"]
          createdAt?: string
          date?: string
          description?: string
          eventId?: number | null
          id?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Expense_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      Feedback: {
        Row: {
          comments: string
          createdAt: string
          eventId: number | null
          guestId: number
          id: number
          rating: number
          updatedAt: string
        }
        Insert: {
          comments: string
          createdAt?: string
          eventId?: number | null
          guestId: number
          id?: number
          rating: number
          updatedAt?: string
        }
        Update: {
          comments?: string
          createdAt?: string
          eventId?: number | null
          guestId?: number
          id?: number
          rating?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Feedback_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Feedback_guestId_fkey"
            columns: ["guestId"]
            isOneToOne: false
            referencedRelation: "Guest"
            referencedColumns: ["id"]
          },
        ]
      }
      FinancialReport: {
        Row: {
          balance: number
          createdAt: string
          eventId: number | null
          id: number
          totalBudget: number
          totalExpense: number
          updatedAt: string
        }
        Insert: {
          balance: number
          createdAt?: string
          eventId?: number | null
          id?: number
          totalBudget: number
          totalExpense: number
          updatedAt?: string
        }
        Update: {
          balance?: number
          createdAt?: string
          eventId?: number | null
          id?: number
          totalBudget?: number
          totalExpense?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "FinancialReport_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      Guest: {
        Row: {
          address: string | null
          confirmed: boolean | null
          createdAt: string
          email: string | null
          eventId: number | null
          firstName: string | null
          gender: string | null
          id: number
          is_deleted: boolean
          lastName: string
          occupation: string | null
          phoneNumber: string | null
          role: string | null
          seatsReserved: number | null
          tableId: number | null
          title: string | null
          updatedAt: string
        }
        Insert: {
          address?: string | null
          confirmed?: boolean | null
          createdAt?: string
          email?: string | null
          eventId?: number | null
          firstName?: string | null
          gender?: string | null
          id?: number
          is_deleted?: boolean
          lastName: string
          occupation?: string | null
          phoneNumber?: string | null
          role?: string | null
          seatsReserved?: number | null
          tableId?: number | null
          title?: string | null
          updatedAt?: string
        }
        Update: {
          address?: string | null
          confirmed?: boolean | null
          createdAt?: string
          email?: string | null
          eventId?: number | null
          firstName?: string | null
          gender?: string | null
          id?: number
          is_deleted?: boolean
          lastName?: string
          occupation?: string | null
          phoneNumber?: string | null
          role?: string | null
          seatsReserved?: number | null
          tableId?: number | null
          title?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Guest_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Guest_tableId_fkey"
            columns: ["tableId"]
            isOneToOne: false
            referencedRelation: "Table"
            referencedColumns: ["id"]
          },
        ]
      }
      import_history: {
        Row: {
          event_id: number | null
          id: number
          imported_at: string | null
          records_imported: number | null
          user_id: string | null
        }
        Insert: {
          event_id?: number | null
          id?: number
          imported_at?: string | null
          records_imported?: number | null
          user_id?: string | null
        }
        Update: {
          event_id?: number | null
          id?: number
          imported_at?: string | null
          records_imported?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Notification: {
        Row: {
          archived: boolean
          createdAt: string
          id: number
          message: string
          read: boolean
          title: string
          type: string
          updatedAt: string
          userId: string | null
        }
        Insert: {
          archived?: boolean
          createdAt?: string
          id?: number
          message: string
          read?: boolean
          title: string
          type: string
          updatedAt?: string
          userId?: string | null
        }
        Update: {
          archived?: boolean
          createdAt?: string
          id?: number
          message?: string
          read?: boolean
          title?: string
          type?: string
          updatedAt?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Notification_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Organization: {
        Row: {
          createdAt: string
          description: string | null
          event_limit: number
          eventId: number | null
          guest_limit_per_event: number
          id: number
          member_limit: number
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          event_limit?: number
          eventId?: number | null
          guest_limit_per_event?: number
          id?: number
          member_limit?: number
          name: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          event_limit?: number
          eventId?: number | null
          guest_limit_per_event?: number
          id?: number
          member_limit?: number
          name?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Organization_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      OrganizationInvite: {
        Row: {
          createdAt: string
          email: string
          expires_at: string
          id: number
          invitedBy: string
          orgId: number
          role: Database["public"]["Enums"]["OrgRole"]
          status: Database["public"]["Enums"]["InviteStatus"]
          token: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          expires_at: string
          id?: number
          invitedBy: string
          orgId: number
          role: Database["public"]["Enums"]["OrgRole"]
          status?: Database["public"]["Enums"]["InviteStatus"]
          token: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          expires_at?: string
          id?: number
          invitedBy?: string
          orgId?: number
          role?: Database["public"]["Enums"]["OrgRole"]
          status?: Database["public"]["Enums"]["InviteStatus"]
          token?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrganizationInvite_invitedBy_fkey"
            columns: ["invitedBy"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "OrganizationInvite_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      OrganizationMember: {
        Row: {
          createdAt: string
          id: number
          orgId: number
          role: Database["public"]["Enums"]["OrgRole"]
          status: Database["public"]["Enums"]["MemberStatus"]
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: number
          orgId: number
          role: Database["public"]["Enums"]["OrgRole"]
          status?: Database["public"]["Enums"]["MemberStatus"]
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: number
          orgId?: number
          role?: Database["public"]["Enums"]["OrgRole"]
          status?: Database["public"]["Enums"]["MemberStatus"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrganizationMember_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "OrganizationMember_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      OrganizationSettings: {
        Row: {
          allow_member_invite: boolean
          createdAt: string
          default_member_role: Database["public"]["Enums"]["OrgRole"]
          id: number
          max_events_per_member: number | null
          orgId: number
          require_admin_approval: boolean
          updatedAt: string
        }
        Insert: {
          allow_member_invite?: boolean
          createdAt?: string
          default_member_role?: Database["public"]["Enums"]["OrgRole"]
          id?: number
          max_events_per_member?: number | null
          orgId: number
          require_admin_approval?: boolean
          updatedAt?: string
        }
        Update: {
          allow_member_invite?: boolean
          createdAt?: string
          default_member_role?: Database["public"]["Enums"]["OrgRole"]
          id?: number
          max_events_per_member?: number | null
          orgId?: number
          require_admin_approval?: boolean
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "OrganizationSettings_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: true
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      RolePermissions: {
        Row: {
          created_at: string | null
          id: number
          permissions: Json
          role: Database["public"]["Enums"]["OrgRole"]
        }
        Insert: {
          created_at?: string | null
          id: number
          permissions: Json
          role: Database["public"]["Enums"]["OrgRole"]
        }
        Update: {
          created_at?: string | null
          id?: number
          permissions?: Json
          role?: Database["public"]["Enums"]["OrgRole"]
        }
        Relationships: []
      }
      RSVP: {
        Row: {
          attending: Database["public"]["Enums"]["RSVPStatus"] | null
          createdAt: string | null
          dietaryPreferences: string | null
          eventId: number | null
          guestId: number
          id: number
          is_deleted: boolean
          plusOne: boolean | null
          updatedAt: string | null
        }
        Insert: {
          attending?: Database["public"]["Enums"]["RSVPStatus"] | null
          createdAt?: string | null
          dietaryPreferences?: string | null
          eventId?: number | null
          guestId: number
          id?: number
          is_deleted?: boolean
          plusOne?: boolean | null
          updatedAt?: string | null
        }
        Update: {
          attending?: Database["public"]["Enums"]["RSVPStatus"] | null
          createdAt?: string | null
          dietaryPreferences?: string | null
          eventId?: number | null
          guestId?: number
          id?: number
          is_deleted?: boolean
          plusOne?: boolean | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "RSVP_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RSVP_guestId_fkey"
            columns: ["guestId"]
            isOneToOne: false
            referencedRelation: "Guest"
            referencedColumns: ["id"]
          },
        ]
      }
      SeatingPlan: {
        Row: {
          createdAt: string
          eventId: number | null
          id: number
          is_deleted: boolean
          seating_plan_name: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          eventId?: number | null
          id?: number
          is_deleted?: boolean
          seating_plan_name?: string | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          eventId?: number | null
          id?: number
          is_deleted?: boolean
          seating_plan_name?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "SeatingPlan_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      Supplier: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["SupplierCategory"]
          contactName: string
          createdAt: string
          description: string | null
          email: string
          id: number
          isVerified: boolean | null
          name: string
          phone: string
          rating: number | null
          updatedAt: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category: Database["public"]["Enums"]["SupplierCategory"]
          contactName: string
          createdAt?: string
          description?: string | null
          email: string
          id?: number
          isVerified?: boolean | null
          name: string
          phone: string
          rating?: number | null
          updatedAt?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["SupplierCategory"]
          contactName?: string
          createdAt?: string
          description?: string | null
          email?: string
          id?: number
          isVerified?: boolean | null
          name?: string
          phone?: string
          rating?: number | null
          updatedAt?: string
          website?: string | null
        }
        Relationships: []
      }
      SupplierService: {
        Row: {
          baseRate: number
          createdAt: string
          description: string | null
          id: number
          maximumHours: number | null
          minimumHours: number | null
          name: string
          rateType: Database["public"]["Enums"]["RateType"]
          supplierId: number
          updatedAt: string
        }
        Insert: {
          baseRate: number
          createdAt?: string
          description?: string | null
          id?: number
          maximumHours?: number | null
          minimumHours?: number | null
          name: string
          rateType: Database["public"]["Enums"]["RateType"]
          supplierId: number
          updatedAt?: string
        }
        Update: {
          baseRate?: number
          createdAt?: string
          description?: string | null
          id?: number
          maximumHours?: number | null
          minimumHours?: number | null
          name?: string
          rateType?: Database["public"]["Enums"]["RateType"]
          supplierId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "SupplierService_supplierId_fkey"
            columns: ["supplierId"]
            isOneToOne: false
            referencedRelation: "Supplier"
            referencedColumns: ["id"]
          },
        ]
      }
      Table: {
        Row: {
          createdAt: string
          id: number
          name: string
          seatingPlanId: number
          seats: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          name: string
          seatingPlanId: number
          seats: number
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: number
          name?: string
          seatingPlanId?: number
          seats?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Table_seatingPlanId_fkey"
            columns: ["seatingPlanId"]
            isOneToOne: false
            referencedRelation: "SeatingPlan"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          eventLimit: number
          id: string
          name: string | null
          orgId: number | null
          role: Database["public"]["Enums"]["UserRole"]
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_type:
            | Database["public"]["Enums"]["SubscriptionType"]
            | null
          subscriptionStatus: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          eventLimit?: number
          id: string
          name?: string | null
          orgId?: number | null
          role?: Database["public"]["Enums"]["UserRole"]
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?:
            | Database["public"]["Enums"]["SubscriptionType"]
            | null
          subscriptionStatus?: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          eventLimit?: number
          id?: string
          name?: string | null
          orgId?: number | null
          role?: Database["public"]["Enums"]["UserRole"]
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?:
            | Database["public"]["Enums"]["SubscriptionType"]
            | null
          subscriptionStatus?: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_event_permission: {
        Args: {
          user_id: string
          event_id: number
          required_permission: string
        }
        Returns: boolean
      }
      create_organization: {
        Args: {
          name: string
          description: string
          owner_id: string
        }
        Returns: {
          createdAt: string
          description: string | null
          event_limit: number
          eventId: number | null
          guest_limit_per_event: number
          id: number
          member_limit: number
          name: string
          updatedAt: string
        }
      }
      create_update_triggers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_random_10_digit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      invite_member: {
        Args: {
          org_id: number
          email: string
          role: Database["public"]["Enums"]["OrgRole"]
          invited_by: string
        }
        Returns: {
          createdAt: string
          email: string
          expires_at: string
          id: number
          invitedBy: string
          orgId: number
          role: Database["public"]["Enums"]["OrgRole"]
          status: Database["public"]["Enums"]["InviteStatus"]
          token: string
          updatedAt: string
        }
      }
      permanently_delete_event: {
        Args: {
          event_id: number
        }
        Returns: {
          createdAt: string
          description: string
          endTime: string
          eventCode: string | null
          guestLimit: number | null
          id: number
          imageUrl: string | null
          is_deleted: boolean
          isVirtual: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          orgId: number | null
          publish: boolean | null
          seatingPlanId: number | null
          startTime: string
          status: Database["public"]["Enums"]["EventStatus"]
          styling: Json | null
          title: string
          updatedAt: string
          userId: string
        }[]
      }
      restore_event: {
        Args: {
          event_id: number
        }
        Returns: {
          createdAt: string
          description: string
          endTime: string
          eventCode: string | null
          guestLimit: number | null
          id: number
          imageUrl: string | null
          is_deleted: boolean
          isVirtual: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          orgId: number | null
          publish: boolean | null
          seatingPlanId: number | null
          startTime: string
          status: Database["public"]["Enums"]["EventStatus"]
          styling: Json | null
          title: string
          updatedAt: string
          userId: string
        }[]
      }
      soft_delete_event: {
        Args: {
          event_id: number
        }
        Returns: {
          createdAt: string
          description: string
          endTime: string
          eventCode: string | null
          guestLimit: number | null
          id: number
          imageUrl: string | null
          is_deleted: boolean
          isVirtual: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          orgId: number | null
          publish: boolean | null
          seatingPlanId: number | null
          startTime: string
          status: Database["public"]["Enums"]["EventStatus"]
          styling: Json | null
          title: string
          updatedAt: string
          userId: string
        }[]
      }
    }
    Enums: {
      BudgetCategory:
        | "Logistics"
        | "Catering"
        | "AV"
        | "Venue"
        | "GuestSpeakers"
        | "Miscellaneous"
      EventPermissions:
        | "VIEW"
        | "EDIT"
        | "DELETE"
        | "MANAGE_GUESTS"
        | "MANAGE_BUDGET"
        | "MANAGE_LOGISTICS"
        | "SEND_INVITATIONS"
        | "VIEW_REPORTS"
      EventStatus: "Draft" | "Published"
      InviteStatus: "Pending" | "Accepted" | "Expired"
      MemberStatus: "Active" | "Inactive" | "Suspended"
      OrgRole: "Owner" | "Admin" | "Member"
      RateType: "Hourly" | "Daily" | "Fixed" | "PerPerson" | "Custom"
      RSVPStatus: "attending" | "not attending" | "pending"
      SubscriptionStatus: "Starter" | "StarterPlus" | "Pro" | "Enterprise"
      SubscriptionType:
        | "monthly"
        | "annual"
        | "Starter"
        | "StarterPlus"
        | "Pro"
        | "Enterprise"
      SupplierCategory:
        | "AV_Equipment"
        | "Sound_System"
        | "Lighting"
        | "FoodCatering"
        | "BeverageCatering"
        | "Decoration"
        | "Photography"
        | "Videography"
        | "Entertainment"
        | "Security"
        | "Transportation"
        | "Other"
      SupplierStatus: "Pending" | "Confirmed" | "Cancelled" | "Completed"
      UserRole: "Owner" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
