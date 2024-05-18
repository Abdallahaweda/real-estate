import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/show/${params.listingId}`);
        const data = await response.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        setError(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <div className="">
      {loading && (
        <p className="flex justify-center text-3xl my-96 ">
          <button
            type="button"
            className=" px-4 py-2  flex items-center justify-center cursor-not-allowed"
            disabled
          >
            <svg
              className="h-32 w-32 mr-3 text-black animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 12a2 2 0 100-4 2 2 0 000 4zM12 20a2 2 0 100-4 2 2 0 000 4zM12 4a2 2 0 100-4 2 2 0 000 4zM19 12a2 2 0 100-4 2 2 0 000 4z"
                fill="currentColor"
              />
            </svg>
            Loading...
          </button>
        </p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-red-700">
          Somthing went wrong!{" "}
          <Link className="text-black" to={"/"}>
            Back
          </Link>
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
}
