/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { api } from '@/trpc/react'
import useProject from '@/hooks/use-project'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AskQuestionCard from '../dashboard/ask-question-card'
import dynamic from 'next/dynamic'
import CodeReferences from '../dashboard/code-references'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageCircle, User } from 'lucide-react'

// Lazy load markdown editor for client only
const MDEditor: any = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), { ssr: false })

const QAPage = () => {
  const {projectId} = useProject()
  const {data: questions} = api.project.getQuestions.useQuery({projectId: projectId})

  const [questionIndex, setQuestionIndex] = useState(0)
  const question = questions?.[questionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions & Réponses</h1>
          <p className="text-gray-600">Explorez et gérez votre base de connaissances de projet</p>
        </div>

        {/* Ask Question Section */}
        <div className="mb-8">
          <AskQuestionCard />
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Questions Sauvegardées ({questions?.length ?? 0})
            </h2>
            {questions && questions.length > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {questions.length} questions
              </Badge>
            )}
          </div>

          {questions && questions.length > 0 ? (
            <div className="grid gap-4">
              {questions.map((question, index) => (
                <Sheet key={question.id}>
                  <SheetTrigger asChild>
                    <Card 
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-blue-500 hover:border-l-blue-600"
                      onClick={() => setQuestionIndex(index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              {question.user.imageURL ? (
                                <img 
                                  className="w-12 h-12 rounded-full object-cover" 
                                  src={question.user.imageURL} 
                                  alt={question.user.firstName ?? "User"} 
                                />
                              ) : (
                                <User className="w-6 h-6 text-white" />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                                {question.question}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
                                <Calendar className="w-4 h-4" />
                                <span>{question.createdAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 line-clamp-3 leading-relaxed mb-3">
                              {question.answer}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {question.user.firstName ?? "Anonymous"}
                              </span>
                              {question.filesReferences && (question.filesReferences as any[]).length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {(question.filesReferences as any[]).length} file{((question.filesReferences as any[]).length !== 1) ? 's' : ''} referenced
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SheetTrigger>
                  
                  <SheetContent className="sm:max-w-[80vw] overflow-y-auto">
                    <SheetHeader className="space-y-6">
                      <SheetTitle className="text-2xl font-bold text-gray-900 leading-tight">
                        {question.question}
                      </SheetTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 pb-4 border-b">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{question.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{question.user.firstName ?? "Anonymous"}</span>
                        </div>
                      </div>
                      
                      <div className="prose prose-gray max-w-none">
                        <MDEditor.Markdown source={question.answer} />
                      </div>
                      
                      {(question.filesReferences as any[]) && (question.filesReferences as any[]).length > 0 && (
                        <div className="pt-4 border-t">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Referenced Files</h4>
                          <CodeReferences filesReferences={question.filesReferences as any} />
                        </div>
                      )}
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No questions yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Start by asking your first question about your project. Your questions and answers will appear here for easy reference.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default QAPage
