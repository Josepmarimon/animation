# Implementació del Sistema de Murs Temàtics

## Resum

S'ha implementat un sistema complet de murs temàtics (Community Walls) on els usuaris poden crear publicacions, donar likes i comentar. Els administradors poden crear i gestionar diferents murs temàtics.

## Característiques Implementades

### 1. **Base de Dades (Supabase)**
- ✅ Taula `walls` - Murs temàtics gestionats per admins
- ✅ Taula `posts` - Publicacions dels usuaris
- ✅ Taula `post_likes` - Sistema de likes
- ✅ Taula `post_comments` - Sistema de comentaris
- ✅ Storage bucket `posts` - Emmagatzematge d'imatges/vídeos
- ✅ Row Level Security (RLS) policies
- ✅ Triggers automàtics per actualitzar contadors
- ✅ 5 Murs per defecte: General, Jobs, Showcase, Technical Help, Events

### 2. **Components React**
- ✅ `WallCard.tsx` - Targeta de mur a la pàgina índex
- ✅ `WallHeader.tsx` - Capçalera del mur
- ✅ `CreatePostForm.tsx` - Formulari per crear publicacions (amb upload d'imatges)
- ✅ `PostCard.tsx` - Targeta de publicació amb likes
- ✅ `CommentSection.tsx` - Secció de comentaris

### 3. **Pàgines**
- ✅ `/wall` - Pàgina índex amb tots els murs
- ✅ `/wall/[slug]` - Feed d'un mur específic
- ✅ `/wall/[slug]/[postId]` - Vista detallada de publicació amb comentaris
- ✅ `/admin/walls` - Panell d'administració per gestionar murs

### 4. **Navegació**
- ✅ Enllaç "Walls" al menú principal (desktop)
- ✅ Enllaç "Walls" al menú mòbil

## Instruccions d'Instal·lació

### Pas 1: Aplicar la Migració a Supabase

La migració SQL està guardada a:
```
supabase/migrations/20250203_011_create_walls_system.sql
```

**Opció A: Utilitzant el Dashboard de Supabase**
1. Obre el teu projecte a https://supabase.com
2. Ves a "SQL Editor"
3. Copia tot el contingut de `20250203_011_create_walls_system.sql`
4. Enganxa-ho a l'editor i executa (Run)

**Opció B: Utilitzant Supabase CLI**
```bash
# Si tens Supabase CLI instal·lat
supabase db push
```

### Pas 2: Verificar la Migració

Després d'aplicar la migració, verifica que s'han creat correctament:
- 4 taules noves: `walls`, `posts`, `post_likes`, `post_comments`
- 1 storage bucket nou: `posts`
- 5 murs per defecte

Pots comprovar-ho amb aquesta query:
```sql
SELECT * FROM public.walls ORDER BY display_order;
```

### Pas 3: Configurar un Usuari Admin (Opcional)

Per accedir al panell d'administració (`/admin/walls`), necessites un usuari amb rol admin:

```sql
-- Reemplaça 'USER_ID' amb l'ID del teu usuari
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

Per obtenir el teu USER_ID:
```sql
SELECT id, email FROM auth.users;
```

### Pas 4: Executar l'Aplicació

```bash
npm run dev
```

Obre el navegador a http://localhost:3000

## Estructura de Fitxers Creats

```
app/
├── wall/
│   ├── page.tsx                    # Índex de murs
│   └── [slug]/
│       ├── page.tsx                # Feed del mur
│       └── [postId]/
│           └── page.tsx            # Detall de publicació
├── admin/
│   └── walls/
│       └── page.tsx                # Panell d'administració
└── components/
    └── walls/
        ├── WallCard.tsx
        ├── WallHeader.tsx
        ├── CreatePostForm.tsx
        ├── PostCard.tsx
        └── CommentSection.tsx

supabase/migrations/
└── 20250203_011_create_walls_system.sql
```

## Funcionalitats Principals

### Per Usuaris Normals:
- Veure tots els murs actius
- Navegar a cada mur temàtic
- Crear publicacions amb text i fins a 4 imatges
- Donar like/unlike a publicacions
- Comentar publicacions
- Veure perfils d'altres usuaris

### Per Administradors:
- Accés a `/admin/walls`
- Crear nous murs temàtics
- Activar/desactivar murs
- Configurar nom, descripció, icona, color i ordre dels murs
- Veure estadístiques de posts per mur

## Murs Per Defecte

1. **General** (💬) - `#6366f1` - Converses generals, networking
2. **Jobs & Opportunities** (💼) - `#10b981` - Ofertes de feina, col·laboracions
3. **Showcase** (🎨) - `#f59e0b` - Mostrar projectes i treballs
4. **Technical Help** (🛠️) - `#8b5cf6` - Preguntes tècniques, tutorials
5. **Events** (📅) - `#ec4899` - Esdeveniments, workshops, conferències

## Seguretat (RLS)

### Walls:
- Tothom pot veure murs actius
- Només admins poden crear/editar/eliminar murs

### Posts:
- Tothom pot veure posts públics
- Usuaris autenticats poden crear posts
- Usuaris poden editar/eliminar els seus propis posts
- Admins poden eliminar qualsevol post

### Likes & Comments:
- Tothom pot veure likes i comentaris
- Usuaris autenticats poden like/comment
- Usuaris poden eliminar els seus propis comentaris
- Admins poden moderar comentaris

## Properes Millores (Opcional)

- [ ] Paginació/Infinite scroll al feed
- [ ] Notificacions quan algú comenta o fa like
- [ ] Cerca de publicacions
- [ ] Filtres (més recents, més populars)
- [ ] Possibilitat d'editar posts i comentaris
- [ ] Suport per vídeos
- [ ] Menció d'usuaris (@username)
- [ ] Hashtags
- [ ] Estadístiques avançades per admins

## Notes Importants

- Les imatges es guarden al storage bucket `posts` amb límit de 20MB per fitxer
- Els posts tenen un límit de 5000 caràcters
- Els comentaris tenen un límit de 2000 caràcters
- Màxim 4 imatges per publicació
- Els contadors (likes_count, comments_count, posts_count) s'actualitzen automàticament via triggers

## Resolució de Problemes

### Error: "Migration timeout"
Si la migració falla per timeout, aplica-la manualment al dashboard de Supabase.

### Error: "Bucket posts already exists"
Normal si ja existeix el bucket. La migració utilitza `ON CONFLICT DO NOTHING`.

### Error: "Permission denied"
Assegura't que RLS està habilitat i les policies estan aplicades correctament.

### No puc accedir a /admin/walls
Verifica que el teu usuari té rol 'admin' a la taula `user_roles`.

## Contacte

Per dubtes o problemes, contacta l'equip de desenvolupament.
