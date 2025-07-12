import { createClient } from "@supabase/supabase-js";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "../../utils/supabase/client";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../config/supabase";
import GoldenRetriever from "@uppy/golden-retriever";



const sanitizeFileName = (name: string): string =>
  name.replace(/[^a-zA-Z0-9.\-_]/g, '_');


export const useUppyWithSupabase = ({ bucketName }: { bucketName: string }) => {
    const [uppy] = useState(() => new Uppy());
    const supabase = supabaseBrowserClient;
    useEffect(() => {
        const initializeUppy = async () => {
        const res = await fetch("/api/auth/user/session");
        const { access_token } = await res.json();
        console.log(access_token)
        if(!uppy.getPlugin('Tus')){
        uppy.use(GoldenRetriever)
        uppy.use(Tus, {
                endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`, 
                retryDelays: [0, 3000, 5000, 10000, 20000], 
                headers: {
                    authorization: `Bearer ${access_token}`, 
                    apikey: SUPABASE_ANON_KEY, 
                },
                uploadDataDuringCreation: true, 
                removeFingerprintOnSuccess: true, 
                chunkSize: 6 * 1024 * 1024, 
                allowedMetaFields: [
                    "bucketName",
                    "objectName",
                    "contentType",
                    "cacheControl",
                ],
                onError: (error) => console.error("Upload error:", error), 
            }).on("file-added", (file) => {
                const randomId = Date.now();
                const objectName = `${randomId}-${sanitizeFileName(file.name||'')}`;
            file.meta = {
              ...file.meta,
              bucketName,
              objectName,
              contentType: file.type,
              cacheControl: "3600",
              originalName: file.name, 
            };
          });
        }
        };
        
        initializeUppy();
    }, [uppy, bucketName]);
    
    return uppy;
};