import axios from "axios";
import React, { useState } from "react";

export default function UploadMultiple() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("previews: ", previews);

  const handleChangeInput = (e) => {
    const fileNames = Array.from(e.target.files);

    setFiles(fileNames);

    // Xử lý xem trước hình ảnh
    const filesPreviews = fileNames.map((file) => URL.createObjectURL(file));

    setPreviews(filesPreviews);
  };

  const handleUploadfiles = async () => {
    if (files.length < 3) {
      alert("Vui lòng chọn ít nhất 3 hình ảnh");
      return;
    }

    try {
      setIsLoading(true);

      // Tạo danh sách promise upload ảnh
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

        const apiUrl = import.meta.env.VITE_API_CLOUD;
        return axios.post(apiUrl, formData);
      });

      // Chờ tất cả upload xong song song
      const responses = await Promise.all(uploadPromises);

      // Lấy URL ảnh từ response
      const urls = responses.map((res) => res.data.url);

      setImageUrls(urls);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setPreviews([]);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <div>Đang tải lên...</div>}

      {previews.length > 0 && (
        <>
          <h3>Danh sách hình ảnh xem trước</h3>
          {previews.map((prev, index) => (
            <img
              height={150}
              width={200}
              src={prev}
              key={index}
              alt={`Hình ảnh xem trước thứ ${index + 1}`}
            />
          ))}
        </>
      )}

      {imageUrls.length > 0 && (
        <>
          <h3>Danh sách hình ảnh sau khi Upload</h3>
          {imageUrls.map((prev, index) => (
            <img
              height={150}
              width={200}
              src={prev}
              key={index}
              alt={`Hình ảnh thứ ${index + 1}`}
            />
          ))}
        </>
      )}

      <input type="file" multiple onChange={handleChangeInput} />
      <button onClick={handleUploadfiles}>Upload</button>
    </div>
  );
}
