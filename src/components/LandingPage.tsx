import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Image,
  Zap,
  Shield,
  Globe,
  Moon,
  Sun,
  ArrowRight,
} from "lucide-react";

interface LandingPageProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  theme: string;
  onToggleTheme: () => void;
}

const features = [
  {
    icon: Zap,
    title: "Real-Time Collaboration",
    description: "Every keystroke, image, and change syncs instantly across all connected users.",
  },
  {
    icon: FileText,
    title: "Monaco Editor",
    description: "Full-featured VS Code editor with syntax highlighting, search, replace, and more.",
  },
  {
    icon: Image,
    title: "Image Board",
    description: "Drag, drop, paste, or upload images. Everyone in the room sees them instantly.",
  },
  {
    icon: Users,
    title: "No Account Required",
    description: "Create or join a room with a simple code. No signup, no login, no hassle.",
  },
  {
    icon: Shield,
    title: "Ephemeral by Design",
    description: "Rooms exist only in memory. When the room is empty, it disappears forever.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Fully responsive. Use it on desktop, tablet, or mobile. Any modern browser.",
  },
];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage({ onCreateRoom, onJoinRoom, theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="relative min-h-screen">
      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ClipNote</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onToggleTheme} className="rounded-full">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" onClick={onJoinRoom} className="hidden sm:flex">
                Join Room
              </Button>
              <Button onClick={onCreateRoom} className="shadow-lg shadow-primary/20">
                Create Room
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                <Zap className="w-3.5 h-3.5" />
                Real-time collaborative workspace
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            >
              <span className="gradient-text">Collaborate</span>
              <br />
              <span>in real time.</span>
              <br />
              <span>No account needed.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Create a room, share the code, and start working together instantly.
              <br />
              Powered by Monaco Editor with real-time sync.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={onCreateRoom} className="w-full sm:w-auto text-base group">
                Create a Room
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onJoinRoom}
                className="w-full sm:w-auto text-base"
              >
                Join a Room
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8 text-sm text-muted-foreground">
              <p>Free · No registration · Works in any browser</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ClipNote provides a seamless real-time collaboration experience.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="glass rounded-2xl p-6 h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to start collaborating.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create a Room",
                description: "Give your workspace a name and a custom code, or generate one randomly.",
              },
              {
                step: "02",
                title: "Share the Code",
                description: "Send the room code to your team. Anyone with the code can join instantly.",
              },
              {
                step: "03",
                title: "Collaborate",
                description: "Edit together in real time. Share images. Everything syncs automatically.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl font-black gradient-text mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-10 sm:p-16 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Create your first room now. It's free, fast, and requires no account.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={onCreateRoom} className="w-full sm:w-auto text-base">
                Create Your First Room
              </Button>
              <Button size="lg" variant="outline" onClick={onJoinRoom} className="w-full sm:w-auto text-base">
                Join Existing Room
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-sm">ClipNote</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Created by{" "}
              <a
                href="https://www.linkedin.com/in/dipak-sonawane-511b5323a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Dipak
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
