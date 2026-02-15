import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Bot, MessageCircle, ShoppingBag } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations('HomePage');
  const nav = useTranslations('Navigation');
  const locale = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl mx-auto flex h-16 items-center px-4 md:px-6">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold text-xl tracking-tighter bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                ParatodosIA
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button variant="ghost" asChild>
                <Link href="/login">{nav('login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{nav('getStarted')}</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
              {t('badge')}
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl whitespace-pre-line">
              {t('title')}
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 whitespace-pre-line text-center">
              {t('subtitle')}
            </p>
            <div className="space-x-4 pt-4">
              <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40" asChild>
                <Link href="/register">
                  {t('startBtn')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg backdrop-blur-sm bg-background/50" asChild>
                <Link href="/preview">
                  {t('demoBtn')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-4 space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 w-full">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{t('features.storefront.title')}</CardTitle>
                <CardDescription className="pt-2 text-base">
                  {t('features.storefront.desc')}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{t('features.whatsapp.title')}</CardTitle>
                <CardDescription className="pt-2 text-base">
                  {t('features.whatsapp.desc')}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{t('features.agents.title')}</CardTitle>
                <CardDescription className="pt-2 text-base">
                  {t('features.agents.desc')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
