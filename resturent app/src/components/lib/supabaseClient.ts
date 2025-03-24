import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://laqpnneqguatxachbvsw.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcXBubmVxZ3VhdHhhY2hidnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MDAzOTYsImV4cCI6MjA1ODM3NjM5Nn0.QPSgL2S1H-N4Ap5n1hrH3w8Dk9Z3lbOJWpVGXO2DcT4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
