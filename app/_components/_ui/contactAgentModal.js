"use client";

import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";

export default function ContactAgentModal({ isOpen, onClose, agent }) {
  if (!agent) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Modal panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card w-full max-w-md rounded-2xl p-6 relative shadow-2xl"
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Agent Info */}
          <div className="flex items-center gap-4 mb-4">
            {agent.photo ? (
              <img
                src={agent.photo}
                alt={agent.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-white">
                {agent.name[0]}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">Agent</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 mb-4">
            <p className="text-sm">
              Phone:{" "}
              <a
                href={`tel:${agent.phone}`}
                className="text-primary hover:underline"
              >
                {agent.phone}
              </a>
            </p>
            {agent.email && (
              <p className="text-sm">
                Email:{" "}
                <a
                  href={`mailto:${agent.email}`}
                  className="text-primary hover:underline"
                >
                  {agent.email}
                </a>
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            You can contact the agent for inquiries, scheduling a viewing, or
            more information about this property.
          </p>

          <Button
            className="w-full"
            size="lg"
            onClick={() => (window.location.href = `tel:${agent.phone}`)}
          >
            Call Agent
          </Button>
        </motion.div>
      </div>
    </Dialog>
  );
}
