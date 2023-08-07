import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Button, Center, Spinner, useToast } from "@chakra-ui/react";

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  const toast = useToast();

  const downloadImage = useCallback(
    async (path) => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
        setIsDownloadingImage(false);
      } catch (error) {
        toast({
          description: `Error downloading image ${error.message}`,
          status: "error",
        });
        setIsDownloadingImage(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (url) downloadImage(url);
  }, [downloadImage, url]);

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(event, filePath);
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
      });
    } finally {
      setIsDownloadingImage(true);
      setUploading(false);
    }
  }

  return (
    <Center mb="2rem" flexDirection="column">
      {avatarUrl && !isDownloadingImage && !uploading ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <Spinner color="#9f7aea" />
      )}
      <Center flexDirection="column" style={{ width: size }}>
        <Button
          mt="0.5rem"
          variant="outline"
          loadingText="Uploading..."
          as="label"
          htmlFor="single"
        >
          Upload
        </Button>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </Center>
    </Center>
  );
}
