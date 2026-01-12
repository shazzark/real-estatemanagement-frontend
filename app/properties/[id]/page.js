"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Share2,
  ChevronLeft,
  Key,
  Calendar,
  User,
  ShoppingCart,
} from "lucide-react";
import { Button } from "../../_components/_ui/button";
import { Card } from "../../_components/_ui/card";
import { Badge } from "../../_components/_ui/badge";
import BookingModal from "../../bookings/bookingModal";
import BookingSuccessModal from "../../bookings/bookingSuccesfullModal";
import WishlistButton from "../../_components/_ui/wishlistButton";
import PropertyMapModal from "../../_components/_ui/propertymapModal";
import ContactAgentModal from "../../_components/_ui/contactAgentModal";
import ProtectedRoute from "../../_components/protectedRoutes";
import { fetchAPI } from "../../_lib/api";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReviewsPanel from "../../_components/_ui/reviewsPanel";
import BuyModal from "../../_components/_ui/buyModal";
import RentModal from "../../_components/_ui/rentModal";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccessOpen, setBookingSuccessOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [contactAgentOpen, setContactAgentOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);

  const handleBookingSuccess = () => {
    setBookingSuccessOpen(true);
  };

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const propertyId = params.id;
        const data = await fetchAPI(`/properties/${propertyId}`);
        setProperty(data.data.property);
      } catch (error) {
        console.error("Error fetching property data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) fetchProperty();
  }, [params.id]);

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        {loading ? (
          <p className="text-lg text-muted-foreground">Loading property...</p>
        ) : (
          <p className="text-lg text-muted-foreground">Property not found.</p>
        )}
      </main>
    );
  }

  // DIRECT IMAGE URL FUNCTION
  const getImageUrl = (image) => {
    if (!image || !image.filename) {
      return "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    // DIRECT PATH: Use /img/properties/
    return `${API_URL}/img/properties/${image.filename}`;
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pb-20">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/properties" passHref>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Listings
              </Button>
            </Link>
            <div className="flex gap-2 items-center">
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Share2 className="h-4 w-4" />
              </Button>
              <WishlistButton propertyId={property.id} />
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-8">
          {/* Image Gallery */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
          >
            {/* Main Image */}
            <div className="md:col-span-3 aspect-video relative overflow-hidden rounded-2xl">
              <img
                src={getImageUrl(property.images[0])}
                alt={property.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                  e.target.src =
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            {/* Side Images */}
            <div className="hidden md:grid grid-rows-3 gap-4">
              {property.images?.slice(1, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl h-full"
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${property.title} view ${i + 2}`}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.error("Side image failed to load:", e.target.src);
                      e.target.src =
                        "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-none px-4 py-1"
                  >
                    Featured
                  </Badge>
                  <Badge variant="outline" className="px-4 py-1 capitalize">
                    {property.propertyType}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-4 py-1 cursor-pointer"
                    onClick={() => setReviewsOpen(true)}
                  >
                    Reviews
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-balance">
                  {property.title}
                </h1>

                {/* CLICKABLE LOCATION DIV */}
                <div
                  className="flex items-center gap-2 text-muted-foreground mb-8 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setShowMap(true)}
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">
                    {property.address?.city}, {property.address?.state}
                  </span>
                </div>

                {/* Key Features Bar */}
                <div className="grid grid-cols-3 gap-8 py-8 border-y mb-12">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary">
                      <Bed className="h-5 w-5" />
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      Bedrooms
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary">
                      <Bath className="h-5 w-5" />
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      Bathrooms
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary">
                      <Square className="h-5 w-5" />
                      <span className="font-medium">{property.area} sq ft</span>
                    </div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      Living Area
                    </span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-serif mb-4">
                    About this Property
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-32"
              >
                <Card className="p-8 border-none shadow-2xl bg-card">
                  {/* PRICE */}
                  <div className="mb-8">
                    <span className="text-sm text-muted-foreground uppercase tracking-widest block mb-2">
                      {property.listingType === "rent"
                        ? "Monthly Rent"
                        : "Asking Price"}
                    </span>
                    <div className="text-4xl font-serif font-medium text-primary">
                      ₦{property.price?.toLocaleString()}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-muted-foreground">
                        Price per sq ft
                      </span>
                      <span className="font-medium">
                        ₦
                        {property.area > 0
                          ? Math.round(
                              property.price / property.area
                            ).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-muted-foreground">
                        Property Type
                      </span>
                      <span className="font-medium capitalize">
                        {property.propertyType}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-muted-foreground">
                        Listing Type
                      </span>
                      <span className="font-medium capitalize">
                        {property.listingType}
                      </span>
                    </div>
                  </div>

                  {/* CTA ACTIONS */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {/* BUY/RENT based on listing type */}
                    {property.listingType === "sale" ? (
                      <Button
                        className="col-span-2 h-14 text-lg font-medium flex items-center justify-center gap-2"
                        size="lg"
                        onClick={() => setBuyOpen(true)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Buy Property
                      </Button>
                    ) : (
                      <Button
                        className="col-span-2 h-14 text-lg font-medium flex items-center justify-center gap-2"
                        size="lg"
                        onClick={() => setRentOpen(true)}
                      >
                        <Key className="w-5 h-5" />
                        Rent Property
                      </Button>
                    )}

                    {/* TOUR */}
                    <Button
                      variant="outline"
                      className="h-12 flex items-center justify-center gap-2"
                      onClick={() => setBookingOpen(true)}
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Tour
                    </Button>

                    {/* CONTACT AGENT */}
                    <Button
                      variant="outline"
                      className="h-12 flex items-center justify-center gap-2"
                      onClick={() => setContactAgentOpen(true)}
                    >
                      <User className="w-4 h-4" />
                      Contact Agent
                    </Button>

                    <Button
                      variant="ghost"
                      className="col-span-2 h-11 flex items-center justify-center gap-2 text-muted-foreground"
                      onClick={() => setReviewsOpen(true)}
                    >
                      View Reviews
                    </Button>
                  </motion.div>

                  <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
                    By proceeding, you agree to our terms of service and privacy
                    policy.
                  </p>
                </Card>
              </motion.div>
            </div>

            {/* Modals */}
            <BookingModal
              propertyId={property.id}
              isOpen={bookingOpen}
              onClose={() => setBookingOpen(false)}
              onSuccess={handleBookingSuccess}
            />
            <ContactAgentModal
              isOpen={contactAgentOpen}
              onClose={() => setContactAgentOpen(false)}
              agent={property.agent}
            />

            <BookingSuccessModal
              isOpen={bookingSuccessOpen}
              onClose={() => setBookingSuccessOpen(false)}
              onGoToDashboard={() => router.push("/dashboard?section=bookings")}
            />

            <ReviewsPanel
              propertyId={property._id}
              isOpen={reviewsOpen}
              onClose={() => setReviewsOpen(false)}
            />

            <BuyModal
              open={buyOpen}
              onClose={() => setBuyOpen(false)}
              property={property}
            />

            <RentModal
              open={rentOpen}
              onClose={() => setRentOpen(false)}
              property={property}
            />

            <PropertyMapModal
              isOpen={showMap}
              onClose={() => setShowMap(false)}
              location={{
                lat: property.geoLocation?.coordinates[1] || 39.1911,
                lng: property.geoLocation?.coordinates[0] || -106.8175,
                address: `${property.address?.city}, ${property.address?.state}`,
              }}
            />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
