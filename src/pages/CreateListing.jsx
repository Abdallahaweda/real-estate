import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promisies = [];

      for (let i = 0; i < files.length; i++) {
        promisies.push(storeImage(files[i]));
      }
      Promise.all(promisies)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image Upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("Max 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  return (
    <div className=" max-w-3xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 ">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg "
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg "
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg "
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rant" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="15"
                required
                className="p-2 border border-gray-300 rounded-lg"
              />
              <p>Bed rooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="15"
                required
                className="p-2 border border-gray-300 rounded-lg"
              />
              <p>Bath rooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="15"
                required
                className="p-2 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">(LE / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="15"
                required
                className="p-2 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">(LE / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 ">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="border border-gray-300 p-3 rounded w-full"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageUpload}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:bg-green-700 hover:text-white disabled:opacity-80 "
            >
              {uploading ? "Uploading..." : " Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((urls, index) => (
              <div
                key={urls}
                className="flex justify-between p-3 items-center border rounded"
              >
                <img
                  src={urls}
                  alt="Listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 p-2 uppercase rounded-lg  hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className=" p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-85 hover:shadow-lg disabled:opacity-80">
            Create listing
          </button>
        </div>
      </form>
    </div>
  );
}
