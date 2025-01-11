import { Database } from "@/utils/supabase/database.types";

export type EventSupplier =
  Database["public"]["Tables"]["EventSupplier"]["Row"];
