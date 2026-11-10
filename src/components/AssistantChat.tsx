"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { ChatMessage } from "@/types/scheme";
import {
  Bot,
  User,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";

export default function AssistantChat() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialFollowUps =
    language === "te"
      ? [
          "జగనన్న విద్యా దీవెన అర్హతలు ఏమిటి?",
          "రైతు భరోసా పథకం కోసం ఏ పత్రాలు అవసరం?",
          "ఆరోగ్యశ్రీ కింద ఎంతవరకు ఉచిత చికిత్స లభిస్తుంది?",
          "పీఎం విశ్వకర్మ పథకం ఎవరికి వర్తిస్తుంది?",
        ]
      : [
          "What are the eligibility criteria for Jagananna Vidya Deevena?",
          "What documents are required for YSR Rythu Bharosa?",
          "How much cashless treatment is covered under Dr. YSR Aarogyasri?",
          "Who is eligible for PM Vishwakarma in Andhra Pradesh?",
        ];

  useEffect(() => {
    // Welcome message
    const welcomeText =
      language === "te"
        ? "నమస్కారం! నేను జనసేతు ఏఐ అసిస్టెంట్‌ని. ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ సంక్షేమ పథకాలు, విద్యార్థి వేతనాలు, వ్యవసాయ రాయితీలు, పెన్షన్లు మరియు అవసరమైన సర్టిఫికెట్ల గురించి నన్ను ఏదైనా అడగవచ్చు."
        : "Namaste! I am the JanSetu AI Assistant. You can ask me anything about government schemes, eligibility guidelines, required certificates, or application procedures in Andhra Pradesh.";

    setMessages([
      {
        id: "msg_welcome",
        sender: "assistant",
        content: welcomeText,
        language,
        followUps: initialFollowUps,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      content: textToSend,
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          history: messages.map((m) => ({ role: m.sender, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: "bot_" + Date.now(),
          sender: "assistant",
          content: data.answer,
          language: data.language || language,
          sources: data.sources || [],
          followUps: data.followUps || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Assistant response failed");
      }
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: "bot_err_" + Date.now(),
        sender: "assistant",
        content:
          language === "te"
            ? "క్షమించండి, సమాచారం పొందడంలో అంతరాయం ఏర్పడింది. దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి."
            : "We encountered an issue retrieving verified scheme data. Please try again shortly.",
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-2xl border border-navy-100 shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-navy-900 text-white p-4 flex items-center justify-between border-b border-navy-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-inner">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
              <span>{t.aiAssistantTitle}</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-medium px-2 py-0.5 rounded border border-teal-400/30">
                Grounded RAG
              </span>
            </h3>
            <p className="text-xs text-navy-300">{t.aiAssistantSubtitle}</p>
          </div>
        </div>

        <button
          onClick={() => {
            const welcomeText =
              language === "te"
                ? "నమస్కారం! నేను జనసేతు ఏఐ అసిస్టెంట్‌ని. ఆంధ్రప్రదేశ్ సంక్షేమ పథకాల గురించి ఏదైనా అడగవచ్చు."
                : "Namaste! I am the JanSetu AI Assistant. Ask me any question regarding government schemes in Andhra Pradesh.";
            setMessages([
              {
                id: "msg_reset",
                sender: "assistant",
                content: welcomeText,
                language,
                followUps: initialFollowUps,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }}
          title="Reset conversation"
          className="text-navy-400 hover:text-white p-2 rounded-lg hover:bg-navy-800 transition text-xs flex items-center space-x-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-navy-50/30">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser ? "bg-navy-800 text-white" : "bg-teal-700 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-navy-900 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-navy-900 border border-navy-100 rounded-tl-none shadow-sm whitespace-pre-line"
                  }`}
                >
                  <div>{msg.content}</div>

                  {/* Grounded Sources Box */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-navy-100 text-xs">
                      <div className="flex items-center space-x-1 font-semibold text-teal-800 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t.sourcesCited}:</span>
                      </div>
                      <div className="space-y-1.5">
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded bg-navy-50 border border-navy-100 text-xs"
                          >
                            <span className="font-medium text-navy-800 truncate mr-2">
                              {src.title}
                            </span>
                            <a
                              href={src.officialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal-700 hover:text-teal-900 flex items-center space-x-1 font-semibold flex-shrink-0"
                            >
                              <span>Official Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-right mt-1 opacity-60">{msg.timestamp}</div>
                </div>

                {/* Follow up suggestions */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-navy-500 flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3 text-teal-600" />
                      <span>{t.quickQuestions}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="text-xs bg-white hover:bg-teal-50 text-navy-700 hover:text-teal-800 border border-navy-200 px-3 py-1.5 rounded-full text-left transition shadow-xs"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-navy-100 text-xs text-navy-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></span>
              <span>
                {language === "te"
                  ? "ప్రభుత్వ రికార్డులను శోధిస్తోంది..."
                  : "Retrieving verified scheme data..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-navy-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.aiInputPlaceholder}
            disabled={loading}
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-navy-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-navy-900 placeholder-navy-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center space-x-1.5 transition shadow-sm"
          >
            <span>{t.btnSend}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-navy-400 mt-2 text-center flex items-center justify-center space-x-1">
          <AlertCircle className="w-3 h-3 text-saffron-500" />
          <span>{t.aiDisclaimer}</span>
        </p>
      </div>
    </div>
  );
}

