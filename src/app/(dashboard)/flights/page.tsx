"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Calendar,
  Users,
  ArrowRight,
  ArrowLeftRight,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { flightsAPI } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { Flight } from "@/types";

const travelClasses = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First Class" },
];

export default function FlightsPage() {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (tripType === "round-trip" && !returnDate) {
      toast.error("Please select a return date");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await flightsAPI.search({
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departure_date: departureDate,
        return_date: tripType === "round-trip" ? returnDate : undefined,
        adults: parseInt(adults),
        travel_class: travelClass,
      });
      setFlights(response.data.flights || []);
      if (response.data.flights?.length === 0) {
        toast.error("No flights found for your search criteria");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Search failed");
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Book Flights
        </h1>
        <p className="text-muted-foreground">
          Search and book domestic & international flights
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTripType("one-way")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                tripType === "one-way"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              One Way
            </button>
            <button
              onClick={() => setTripType("round-trip")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                tripType === "round-trip"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Round Trip
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="From"
                placeholder="Airport code (e.g., LOS)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                leftIcon={<Plane className="w-5 h-5 rotate-45" />}
                maxLength={3}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  const temp = origin;
                  setOrigin(destination);
                  setDestination(temp);
                }}
                className="hidden md:flex absolute left-0 top-1/2 -translate-x-1/2 translate-y-1 z-10 w-10 h-10 rounded-full glass items-center justify-center hover:bg-muted transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4 text-primary" />
              </button>
              <Input
                label="To"
                placeholder="Airport code (e.g., ABV)"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                leftIcon={<Plane className="w-5 h-5 -rotate-45" />}
                maxLength={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Departure Date"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              leftIcon={<Calendar className="w-5 h-5" />}
            />

            {tripType === "round-trip" && (
              <Input
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || new Date().toISOString().split("T")[0]}
                leftIcon={<Calendar className="w-5 h-5" />}
              />
            )}

            <Select
              label="Passengers"
              options={[
                { value: "1", label: "1 Adult" },
                { value: "2", label: "2 Adults" },
                { value: "3", label: "3 Adults" },
                { value: "4", label: "4 Adults" },
              ]}
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />

            <Select
              label="Class"
              options={travelClasses}
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
            />
          </div>

          <Button
            className="w-full md:w-auto"
            size="lg"
            onClick={handleSearch}
            isLoading={isSearching}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Search Flights
          </Button>
        </CardContent>
      </Card>

      {isSearching && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for flights...</p>
          </div>
        </div>
      )}

      {!isSearching && hasSearched && flights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            {flights.length} Flight{flights.length > 1 ? "s" : ""} Found
          </h2>
          {flights.map((flight, index) => (
            <Card key={index} hover className="cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Plane className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{flight.airline}</p>
                      <p className="text-sm text-muted-foreground">
                        {flight.flight_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {flight.departure_time}
                      </p>
                      <p className="text-sm text-muted-foreground">{flight.origin}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {flight.duration}
                      </p>
                      <div className="w-full h-0.5 bg-border relative my-2">
                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {flight.stops === 0 ? "Direct" : `${flight.stops} stop(s)`}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {flight.arrival_time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.destination}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gradient-gold">
                      {formatCurrency(flight.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">per person</p>
                    <Button size="sm" className="mt-2">
                      Select
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isSearching && hasSearched && flights.length === 0 && (
        <Card>
          <CardContent className="py-20 text-center">
            <Plane className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No Flights Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or dates
            </p>
          </CardContent>
        </Card>
      )}

      {!hasSearched && (
        <Card>
          <CardContent className="py-20 text-center">
            <Plane className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Search for Flights
            </h3>
            <p className="text-muted-foreground">
              Enter your travel details above to find available flights
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
