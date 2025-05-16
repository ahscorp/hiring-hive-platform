
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create the resumes bucket
    const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.createBucket("resumes", { 
      public: true,
      fileSizeLimit: 3145728, // 3MB limit
      allowedMimeTypes: [
        "application/pdf", 
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ]
    });

    if (bucketError) {
      throw bucketError;
    }

    // Set up storage policy
    // Allow authenticated users to upload
    const { error: policyError } = await supabaseAdmin
      .storage
      .from("resumes")
      .createPolicy({
        name: "Allow public access",
        definition: {
          name: "Allow public access to resumes",
          id: "public-access",
          match: ".+",
          statement: "Authentication is not required and there is no Row Level Security for the storage",
          effect: "ALLOW"
        },
        type: "READ"
      });

    if (policyError) {
      throw policyError;
    }

    return new Response(
      JSON.stringify({ message: "Storage bucket created successfully" }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating storage bucket:", error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 500,
      }
    );
  }
});
