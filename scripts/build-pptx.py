# -*- coding: utf-8 -*-
"""Construit exports/schemas-esol.pptx : les cinq schémas clés de la maquette
en formes natives PowerPoint (rectangles, connecteurs, zones de texte), donc
éditables sans coder, dans PowerPoint comme dans Google Slides.

Usage : python scripts/build-pptx.py   (relançable, écrase l'export précédent)

Sources qui font foi (recopiées à la main dans ce script) :
  - diapo 2  src/components/illustration-roles.html        (sentier des 5 niveaux)
  - diapo 3  src/components/diagram-gouvernance.md         (« Variante simplifiée »)
  - diapo 4  src/components/diagram-roles-droits.md        (« Vue communauté »)
  - diapo 5  src/components/illustration-premiers-pas.html (frise des 5 jalons)
  - diapo 6  src/data/communities.json (lu à l'exécution)  (village schématique)

Polices : Outfit (titres, étiquettes) et Inter (corps) - natives dans Google
Slides, à installer pour PowerPoint (Google Fonts, licence OFL). Tout autofit
est désactivé et les boîtes gardent ~15 % de marge : la mise en page tient
aussi avec une police de substitution.
"""

import json
import os
import re
import sys

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

from pptx.enum.dml import MSO_LINE_DASH_STYLE as DASH

# ---------------------------------------------------------------------------
# Palette : tokens CSS de src/components/head.html (source de vérité).
# ---------------------------------------------------------------------------
PRIMARY = "9C3F00"        # --primary          terre
PRIMARY_DARK = "7A3000"   # --primary-dark
PRIMARY_LIGHT = "C05814"  # --primary-light
OLIVE = "586330"          # --secondary        olive
OLIVE_LIGHT = "D8E6A6"    # --secondary-light
TEXT_MAIN = "1A1512"      # --text-main
TEXT_MUTED = "6B5C54"     # --text-muted
TEXT_LIGHT = "FDFBF9"     # --text-light
BG_BASE = "FAF8F5"        # --bg-base          fond crème des pages
BOIS = "B09570"           # bordure « espaces » des schémas Mermaid
#                           (diagram-roles-droits.md, classDef espace)

# Catégories de communautés (couleur / fond) - tokens --cat-* de head.html.
CAT = {
    "Formation":      ("9C3F00", "FFDBCC"),
    "Recherche":      ("586330", "DBE9A9"),
    "Éducation":      ("705740", "FEDCBE"),
    "Professionnel":  ("586330", "D8E6A6"),
    "Politique":      ("4E4E88", "EEEEF8"),
    "Culture":        ("885060", "F5EDF2"),
    "Institutionnel": ("8C7166", "F3EFEC"),
}

# Niveaux 1 à 5 (fond, bordure, texte titre, texte droits) - couleurs exactes
# de illustration-roles.html.
NIVEAUX = [
    ("F3EFEC", "8C7166", "5A4A42", "4A3F38"),
    ("EEEEF8", "4E4E88", "3D3D5C", "3D3D5C"),
    ("FFDBCC", "9C3F00", "7A3000", "7A3000"),
    ("DBE9A9", "586330", "3D4D1F", "3D4D1F"),
    ("9C3F00", "7A3000", "FDFBF9", "FFDBCC"),
]

SOL_CHARTE = "6B5C54"         # bande de sol du sentier des niveaux (la charte)
SOL_CHARTE_BAS = "5A4836"     # liseré sombre sous la bande
SOL_VILLAGE = "4A3728"        # sol du village (illustration-village.html)
CHEMIN = "C4AA82"             # sol de la frise premiers pas et sentier des niveaux
POTEAU = "705740"             # poteaux des panneaux du sentier (bois)
EDGE_LABEL_BG = "DBE9A9"      # fond des étiquettes de flèches (thème Mermaid)

F_TITRE = "Outfit"
F_CORPS = "Inter"

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO, "exports")
OUT_PPTX = os.path.join(OUT_DIR, "schemas-esol.pptx")

W, H = 13.3333, 7.5  # diapositive 16:9 en pouces


def rgb(hexa):
    return RGBColor.from_string(hexa)


def blend(fg, bg, alpha):
    """Couleur aplatie équivalente à `fg` posé à `alpha` sur `bg` (les SVG
    sources utilisent des opacités ; PowerPoint préfère des aplats simples)."""
    f, b = rgb(fg), rgb(bg)
    mix = tuple(round(alpha * fc + (1 - alpha) * bc) for fc, bc in zip(f, b))
    return "%02X%02X%02X" % mix


# ---------------------------------------------------------------------------
# Petits utilitaires de construction
# ---------------------------------------------------------------------------

def _no_shadow(shape):
    """Rendu plat : neutralise l'ombre et retire la référence aux effets du
    thème (le gabarit PowerPoint par défaut ajoute une ombre portée aux
    formes, que LibreOffice et PowerPoint appliqueraient sinon)."""
    try:
        shape.shadow.inherit = False
    except (AttributeError, ValueError):
        pass
    style = shape._element.find(qn("p:style"))
    if style is not None:
        shape._element.remove(style)


def _fill_line(shape, fill=None, line=None, line_w=1.0, dash=None):
    if fill is None:
        shape.fill.background()
    else:
        shape.fill.solid()
        shape.fill.fore_color.rgb = rgb(fill)
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = rgb(line)
        shape.line.width = Pt(line_w)
        if dash is not None:
            shape.line.dash_style = dash


def add_shape(slide, kind, x, y, w, h, fill=None, line=None, line_w=1.0,
              dash=None):
    shp = slide.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    _fill_line(shp, fill, line, line_w, dash)
    _no_shadow(shp)
    return shp


def _set_tf(tf, wrap=True, anchor=MSO_ANCHOR.TOP, margins=0.03):
    tf.word_wrap = wrap
    tf.auto_size = MSO_AUTO_SIZE.NONE  # jamais d'autofit (cf. docstring)
    tf.vertical_anchor = anchor
    for attr in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, attr, Inches(margins))


def _fill_paras(tf, paras, font, size, bold, color, align, line_spacing,
                space_after):
    """paras : liste de paragraphes ; chaque paragraphe est une str ou une
    liste de runs (dictionnaires {t, font, size, bold, italic, color})."""
    for i, para in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if line_spacing:
            p.line_spacing = line_spacing
        if space_after is not None:
            p.space_after = Pt(space_after)
        runs = [{"t": para}] if isinstance(para, str) else para
        for spec in runs:
            r = p.add_run()
            r.text = spec["t"]
            r.font.name = spec.get("font", font)
            r.font.size = Pt(spec.get("size", size))
            r.font.bold = spec.get("bold", bold)
            r.font.italic = spec.get("italic", False)
            r.font.color.rgb = rgb(spec.get("color", color))


def add_text(slide, x, y, w, h, paras, font=F_CORPS, size=10, bold=False,
             color=TEXT_MAIN, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
             wrap=True, line_spacing=None, space_after=0):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    _set_tf(box.text_frame, wrap=wrap, anchor=anchor, margins=0.02)
    _fill_paras(box.text_frame, paras, font, size, bold, color, align,
                line_spacing, space_after)
    _no_shadow(box)
    return box


def shape_text(shape, paras, font=F_TITRE, size=10, bold=False,
               color=TEXT_MAIN, align=PP_ALIGN.CENTER,
               anchor=MSO_ANCHOR.MIDDLE, wrap=True, line_spacing=1.0,
               space_after=0, margins=0.03):
    _set_tf(shape.text_frame, wrap=wrap, anchor=anchor, margins=margins)
    _fill_paras(shape.text_frame, paras, font, size, bold, color, align,
                line_spacing, space_after)


def add_arrow(slide, x1, y1, x2, y2, color=PRIMARY, width=1.5, dash=None,
              head=True):
    conn = slide.shapes.add_connector(
        MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    conn.line.color.rgb = rgb(color)
    conn.line.width = Pt(width)
    if dash is not None:
        conn.line.dash_style = dash
    _no_shadow(conn)
    if head:  # pointe de flèche (non exposée par python-pptx : XML direct)
        ln = conn.line._get_or_add_ln()
        tail = ln.makeelement(qn("a:tailEnd"),
                              {"type": "triangle", "w": "med", "len": "med"})
        ln.append(tail)
    return conn


def new_slide(prs, notes, bg=BG_BASE):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # disposition vide
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = rgb(bg)
    slide.notes_slide.notes_text_frame.text = notes
    return slide


def slide_title(slide, text, sub=None):
    add_text(slide, 0.7, 0.22, W - 1.4, 0.34, [text], font=F_TITRE, size=15,
             bold=True, color=PRIMARY, align=PP_ALIGN.CENTER)
    if sub:
        add_text(slide, 1.2, 0.56, W - 2.4, 0.28, [sub], font=F_CORPS,
                 size=10, color=TEXT_MUTED, align=PP_ALIGN.CENTER)


# ---------------------------------------------------------------------------
# Diapo 1 : titre et mode d'emploi
# ---------------------------------------------------------------------------

def build_titre(prs):
    slide = new_slide(prs, "Fichier généré par scripts/build-pptx.py "
                           "(dépôt e-sol-demo). La source de chaque schéma "
                           "est indiquée dans les notes de sa diapositive.")
    add_text(slide, 0.9, 0.85, 8.6, 0.75, ["Schémas e-Sol"], font=F_TITRE,
             size=34, bold=True, color=PRIMARY)
    add_text(slide, 0.9, 1.62, 9.4, 0.4,
             ["Cinq schémas éditables, contrepartie des visuels SVG et "
              "Mermaid de la maquette e-sol-demo."],
             font=F_CORPS, size=12.5, color=TEXT_MUTED)

    # Motif : le sentier des cinq niveaux, en haut à droite : cinq jalons de
    # même taille, côte à côte sur la même ligne (aucun au-dessus des autres).
    base_y, mini_w = 1.95, 0.44
    for i, (bg, border, _t, _b) in enumerate(NIVEAUX):
        add_shape(slide, MSO_SHAPE.RECTANGLE, 10.30 + i * mini_w,
                  base_y - 0.30, mini_w, 0.30, fill=bg, line=border, line_w=1.0)

    blocs = [
        ("À quoi sert ce fichier",
         "La version modifiable des schémas de la maquette : les mêmes "
         "contenus, en formes natives que chacun·e peut retoucher sans "
         "coder, dans PowerPoint comme dans Google Slides."),
        ("Comment éditer",
         "Cliquer sur une forme pour corriger son texte ; la glisser pour "
         "la déplacer ; tirer les poignées pour la redimensionner. Les "
         "couleurs et leurs correspondances sont rappelées en dernière "
         "diapositive."),
        ("Polices",
         "Titres en Outfit, textes en Inter (Google Fonts, licence "
         "libre OFL). Google Slides les propose d'origine ; dans "
         "PowerPoint, installer les deux familles pour un rendu fidèle. "
         "Sans elles, une police de substitution s'affiche et la mise en "
         "page est prévue pour le supporter."),
        ("Licence et source",
         "Contenu sous licence CC BY-SA. Source : dépôt e-sol-demo ; le "
         "fichier d'origine de chaque schéma est indiqué dans les "
         "commentaires du présentateur de sa diapositive."),
    ]
    bw, bh, gx, gy = 5.75, 1.95, 0.9, 0.35
    for i, (titre, corps) in enumerate(blocs):
        bx = 0.9 + (i % 2) * (bw + gx)
        by = 2.55 + (i // 2) * (bh + gy)
        card = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, bx, by, bw, bh,
                         fill="FFFFFF", line=blend(PRIMARY, "FFFFFF", 0.2),
                         line_w=1.0)
        card.adjustments[0] = 0.07
        add_text(slide, bx + 0.25, by + 0.18, bw - 0.5, 0.32, [titre],
                 font=F_TITRE, size=12.5, bold=True, color=TEXT_MAIN)
        add_text(slide, bx + 0.25, by + 0.55, bw - 0.5, bh - 0.7, [corps],
                 font=F_CORPS, size=10, color=TEXT_MUTED, line_spacing=1.15)

    add_text(slide, 0.9, 6.95, W - 1.8, 0.3,
             ["e-Sol - réseau collaboratif pour la connaissance et la "
              "préservation des sols, porté par l'AFES"],
             font=F_CORPS, size=9, color=TEXT_MUTED)


# ---------------------------------------------------------------------------
# Diapo 2 : le sentier des cinq niveaux
#
# Refonte du 19 août 2026 (retour de revue : l'escalier hiérarchisait les
# rôles). Cinq panneaux identiques, à la même hauteur, plantés le long d'un
# sentier ; les transitions sont des tronçons de chemin étiquetés ; le cumul
# des droits est figuré par des jetons qui s'additionnent sous chaque panneau
# (1 jeton au niveau 1, 5 au niveau 5), pas par de la hauteur. La bande de
# sol (la charte) porte le sentier entier. Textes et couleurs identiques au
# SVG source.
# ---------------------------------------------------------------------------

def build_sentier(prs):
    slide = new_slide(prs, "Source : src/components/illustration-roles.html "
                           "(dépôt e-sol-demo).")
    slide_title(slide, "LES CINQ NIVEAUX DE PARTICIPATION",
                "Chaque niveau conserve tous les droits du précédent : "
                "les droits s'additionnent.")

    panel_w, pitch = 2.30, 2.52
    x0 = (W - (4 * pitch + panel_w)) / 2          # cinq panneaux centrés
    panel_y, panel_h = 1.40, 3.15                 # même hauteur pour tous
    xs = [x0 + i * pitch for i in range(5)]
    centres = [x + panel_w / 2 for x in xs]
    post_y, trail_y = panel_y + panel_h, 5.70     # poteaux puis sentier
    sol_y = 6.08                                  # bande de sol (la charte)

    haltes = [
        (["Visiteur·euse", "non inscrit·e"],
         ["pages publiques et annuaire", "lire le forum", "s'inscrire"]),
        (["Membre", "inscrit·e"],
         ["+ sa fiche dans l'annuaire", "+ commenter",
          "+ fiches action, annonces", "+ rejoindre une communauté"]),
        (["Membre d'une", "communauté"],
         ["+ espaces de sa communauté", "+ documents, discussions",
          "+ cercle restreint,", "   si la communauté l'active *"]),
        (["Animateur·rice", "de communauté"],
         ["+ accueillir les nouveaux", "+ éditer les pages",
          "+ gérer le cercle restreint *", "+ modérer son périmètre"]),
        (["Administrateur·rice", "de la plateforme"],
         ["+ comptes et groupes", "+ droits d'accès des pages",
          "+ formulaires et statuts", "+ tout éditer ou supprimer"]),
    ]

    # Bande de sol : la charte porte le sentier et toutes les haltes.
    add_shape(slide, MSO_SHAPE.RECTANGLE, 0, sol_y, W, 0.40,
              fill=SOL_CHARTE, line=None)
    add_shape(slide, MSO_SHAPE.RECTANGLE, 0, sol_y + 0.40, W, 0.07,
              fill=SOL_CHARTE_BAS, line=None)
    add_text(slide, 1.0, sol_y + 0.07, W - 2.0, 0.28,
             ["LE SOL DU VILLAGE - LA CHARTE S'APPLIQUE À TOUS LES NIVEAUX"],
             font=F_TITRE, size=10, bold=True, color=TEXT_LIGHT,
             align=PP_ALIGN.CENTER)

    # Le sentier : un chemin continu, d'un seul niveau, posé sur le sol.
    add_shape(slide, MSO_SHAPE.RECTANGLE, 0, trail_y, W, sol_y - trail_y,
              fill=CHEMIN, line=None)

    # Poteaux : cinq panneaux plantés dans le sentier, à la même hauteur.
    for cx in centres:
        add_shape(slide, MSO_SHAPE.RECTANGLE, cx - 0.035, post_y, 0.07,
                  trail_y - post_y + 0.15, fill=POTEAU, line=None)

    for i, ((titre, droits), (bg, border, c_titre, c_droits)) in enumerate(
            zip(haltes, NIVEAUX)):
        px = xs[i]
        add_shape(slide, MSO_SHAPE.RECTANGLE, px, panel_y, panel_w, panel_h,
                  fill=bg, line=border, line_w=2.0)
        # pastille numérotée (niveau 5 : pastille claire, chiffre terre)
        pastille = add_shape(slide, MSO_SHAPE.OVAL, px + 0.13,
                             panel_y + 0.10, 0.34, 0.34,
                             fill=TEXT_LIGHT if i == 4 else border, line=None)
        shape_text(pastille, [str(i + 1)], font=F_TITRE, size=11, bold=True,
                   color=PRIMARY if i == 4 else TEXT_LIGHT, margins=0.0)
        add_text(slide, px + 0.52, panel_y + 0.07, panel_w - 0.62, 0.44,
                 titre, font=F_TITRE, size=10.5, bold=True, color=c_titre,
                 line_spacing=1.0)
        add_text(slide, px + 0.13, panel_y + 0.60, panel_w - 0.26, 2.0,
                 droits, font=F_CORPS, size=8.5, color=c_droits,
                 line_spacing=1.0, space_after=3)
        # jetons cumulatifs : le niveau i porte les jetons 1 à i, posés sur
        # une plaquette claire (sinon les jetons terre disparaissent sur le
        # fond sombre du panneau 5)
        pill = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, px + 0.115,
                         panel_y + panel_h - 0.405, 0.24 + i * 0.215, 0.24,
                         fill=blend("FDFBF9", bg, 0.9),
                         line=None if i == 4 else blend(border, bg, 0.35),
                         line_w=1.0)
        pill.adjustments[0] = 0.5
        for j in range(i + 1):
            add_shape(slide, MSO_SHAPE.OVAL, px + 0.16 + j * 0.215,
                      panel_y + panel_h - 0.36, 0.15, 0.15,
                      fill=NIVEAUX[j][1], line=TEXT_LIGHT, line_w=1.0)

    # Transitions : des tronçons de sentier étiquetés, à plat. Comme dans le
    # SVG source : trait plein pour « s'inscrire » et « rejoindre »,
    # pointillés pour les passages marqués * (proposition, à valider).
    transitions = [("s'inscrire", None), ("rejoindre", None),
                   ("animer *", DASH.DASH), ("désignation *", DASH.DASH)]
    fleche_y = trail_y + (sol_y - trail_y) / 2
    for i, (label, dash) in enumerate(transitions):
        ca, cb = centres[i], centres[i + 1]
        add_arrow(slide, ca + 0.42, fleche_y, cb - 0.30, fleche_y,
                  color=PRIMARY, width=1.5, dash=dash)
        add_text(slide, (ca + cb) / 2 - 0.9, trail_y - 0.52, 1.8, 0.28,
                 [label], font=F_CORPS, size=8.5, bold=True, color=TEXT_MUTED,
                 align=PP_ALIGN.CENTER, wrap=False)

    add_text(slide, x0, 7.08, 6.5, 0.3,
             ["* proposition, à valider - source : référentiel des rôles "
              "et droits e-Sol"], font=F_CORPS, size=9, color=TEXT_MUTED)
    add_text(slide, W - x0 - 3.5, 7.08, 3.5, 0.3,
             ["niveaux cumulatifs : 1 à 5"], font=F_CORPS, size=9,
             color=TEXT_MUTED, align=PP_ALIGN.RIGHT)


# ---------------------------------------------------------------------------
# Diapo 3 : gouvernance, variante simplifiée
# ---------------------------------------------------------------------------

def build_gouvernance(prs):
    slide = new_slide(prs, "Source : src/components/diagram-gouvernance.md, "
                           "section « Variante simplifiée » "
                           "(dépôt e-sol-demo).")
    slide_title(slide, "LA GOUVERNANCE E-SOL - VARIANTE SIMPLIFIÉE",
                "Qui anime, qui produit, qui en bénéficie : la chaîne en "
                "quatre maillons de la charte.")

    cy = 3.75  # axe vertical du diagramme
    nodes = [
        # (forme, x, w, h, fill, border, texte, sous-texte, couleur texte)
        (MSO_SHAPE.CAN, 0.40, 1.50, 1.75, PRIMARY, PRIMARY_DARK,
         "AFES", "+ COPIL", TEXT_LIGHT),
        (MSO_SHAPE.RECTANGLE, 3.36, 2.30, 1.35, "FFDBCC", PRIMARY,
         "Communautés", "les maisons du village", PRIMARY_DARK),
        (MSO_SHAPE.RECTANGLE, 7.12, 2.30, 1.35, "DBE9A9", OLIVE,
         "Communs", "les outils partagés", "3D4D1F"),
        (MSO_SHAPE.RECTANGLE, 10.88, 2.05, 1.35, "F5EDF2", "885060",
         "Société", "bénéficiaires", "5A3038"),
    ]
    for kind, x, w, h, fill, border, titre, sous, ctext in nodes:
        node = add_shape(slide, kind, x, cy - h / 2, w, h, fill=fill,
                         line=border, line_w=2.0)
        shape_text(node, [
            [{"t": titre, "size": 13, "bold": True}],
            [{"t": sous, "size": 10.5, "italic": True}],
        ], font=F_TITRE, color=ctext, line_spacing=1.05, space_after=2)

    fleches = [(1.90, 3.36, "anime", 0.70),
               (5.66, 7.12, "produisent", 1.00),
               (9.42, 10.88, "bénéficient à", 1.18)]
    for xa, xb, label, lw in fleches:
        add_arrow(slide, xa, cy, xb - 0.03, cy, color=PRIMARY, width=1.75)
        chip = add_shape(slide, MSO_SHAPE.RECTANGLE, (xa + xb) / 2 - lw / 2,
                         cy - 0.16, lw, 0.32, fill=EDGE_LABEL_BG, line=None)
        shape_text(chip, [label], font=F_TITRE, size=10, color=TEXT_MAIN,
                   margins=0.0)


# ---------------------------------------------------------------------------
# Diapo 4 : vue communauté (trois positions, trois espaces)
# ---------------------------------------------------------------------------

def build_vue_communaute(prs):
    slide = new_slide(prs, "Source : src/components/diagram-roles-droits.md, "
                           "section « Vue communauté » (dépôt e-sol-demo). "
                           "Note de lecture : src/pages/roles-et-droits.html.")
    slide_title(slide, "LA VUE COMMUNAUTÉ - TROIS POSITIONS, TROIS ESPACES")

    fx, fw = 3.35, 9.45  # cadres à droite
    fcx = fx + fw / 2

    # Cadre « espaces partagés »
    add_shape(slide, MSO_SHAPE.RECTANGLE, fx, 0.95, fw, 2.05,
              fill="F6FAEA", line=OLIVE, line_w=1.5)
    add_text(slide, fx + 0.15, 1.02, fw - 0.3, 0.3,
             ["ESPACES PARTAGÉS - tous les membres de la communauté"],
             font=F_TITRE, size=11, bold=True, color="3D4D1F")
    for bx, lignes in ((fcx - 4.05, ["Pages et documents", "de la communauté"]),
                       (fcx + 0.45, ["Discussions -", "catégorie de forum"])):
        box = add_shape(slide, MSO_SHAPE.RECTANGLE, bx, 1.62, 3.6, 0.92,
                        fill=TEXT_LIGHT, line=BOIS, line_w=1.25)
        shape_text(box, lignes, font=F_TITRE, size=10.5, color=TEXT_MAIN,
                   line_spacing=1.1)

    # Cadre « cercle restreint » (pointillés : espace optionnel)
    add_shape(slide, MSO_SHAPE.RECTANGLE, fx, 3.30, fw, 1.60,
              fill="F5EDF2", line="885060", line_w=1.5, dash=DASH.DASH)
    add_text(slide, fx + 0.15, 3.37, fw - 0.3, 0.3,
             ["CERCLE RESTREINT - accès sur permission, seulement si la "
              "communauté l'active*"],
             font=F_TITRE, size=11, bold=True, color="5A3038")
    box = add_shape(slide, MSO_SHAPE.RECTANGLE, fcx - 3.3, 3.90, 6.6, 0.86,
                    fill=TEXT_LIGHT, line=BOIS, line_w=1.25)
    shape_text(box, ["Pages réservées - documents de travail",
                     "se prolonge sur le forum (catégorie restreinte)"],
               font=F_TITRE, size=10.5, color=TEXT_MAIN, line_spacing=1.1)

    # Cadre « animation »
    add_shape(slide, MSO_SHAPE.RECTANGLE, fx, 5.20, fw, 1.25,
              fill="FFDBCC", line=PRIMARY, line_w=1.5)
    add_text(slide, fx + 0.15, 5.27, fw - 0.3, 0.3,
             ["ANIMATION - réservé aux animateur·rices"],
             font=F_TITRE, size=11, bold=True, color=PRIMARY_DARK)
    box = add_shape(slide, MSO_SHAPE.RECTANGLE, fcx - 2.5, 5.68, 5.0, 0.62,
                    fill=TEXT_LIGHT, line=BOIS, line_w=1.25)
    shape_text(box, ["Accueil - réglages - modération du périmètre"],
               font=F_TITRE, size=10.5, color=TEXT_MAIN)

    # Trois positions (pilules), à gauche
    pilules = [(1.45, ["Membre de la", "communauté"]),
               (2.75, ["Membre du", "cercle restreint*"]),
               (4.95, ["Animateur·rice"])]
    for py, lignes in pilules:
        ph = 0.66 if len(lignes) > 1 else 0.5
        pill = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, 0.55, py,
                         2.05, ph, fill="EEEEF8", line="4E4E88", line_w=1.5)
        pill.adjustments[0] = 0.5
        shape_text(pill, lignes, font=F_TITRE, size=10.5, color="3D3D5C",
                   line_spacing=1.0)

    # Flèches « a accès à » ; l'accès de l'animateur·rice à l'espace
    # animation est en trait épais, comme dans le schéma Mermaid.
    px = 2.62
    add_arrow(slide, px, 1.78, fx - 0.04, 1.90, width=1.5)          # M -> partagés
    add_arrow(slide, px, 3.02, fx - 0.04, 2.48, width=1.5)          # CR -> partagés
    add_arrow(slide, px, 3.16, fx - 0.04, 3.95, width=1.5)          # CR -> cercle
    add_arrow(slide, px, 5.08, fx - 0.04, 2.88, width=1.5)          # AN -> partagés
    add_arrow(slide, px, 5.16, fx - 0.04, 4.35, width=1.5)          # AN -> cercle
    add_arrow(slide, px, 5.32, fx - 0.04, 5.85, width=3.0)          # AN => animation

    add_text(slide, 1.0, 6.62, W - 2.0, 0.62,
             ["Les trois cadres sont l'intérieur d'une même communauté ; "
              "une flèche se lit « a accès à ». Le cadre en pointillés est "
              "optionnel : une communauté sans cercle restreint fonctionne "
              "très bien avec deux positions seulement."],
             font=F_CORPS, size=9.5, color=TEXT_MUTED,
             align=PP_ALIGN.CENTER, line_spacing=1.2)


# ---------------------------------------------------------------------------
# Diapo 5 : premiers pas, la frise des cinq jalons
# ---------------------------------------------------------------------------

def build_premiers_pas(prs):
    slide = new_slide(prs, "Source : src/components/"
                           "illustration-premiers-pas.html "
                           "(dépôt e-sol-demo).")
    slide_title(slide, "PREMIERS PAS - CINQ JALONS POUR S'INSTALLER",
                "Cinq gestes simples, dans l'ordre, pour prendre ses "
                "marques dans le village e-Sol.")

    ly = 3.65  # ligne de sol
    jalons = [
        ("1", "Profil", "je me présente", PRIMARY, PRIMARY),
        ("2", "Charte", "je lis ce que j'ai signé", TEXT_MUTED, "4A3728"),
        # le jalon 3 est à 90 % d'opacité dans le SVG : couleur aplatie
        ("3", "Maison", "je rejoins 1-2 communautés",
         blend(PRIMARY, BG_BASE, 0.9), PRIMARY),
        ("4", "Forum", "je dis bonjour", PRIMARY_LIGHT, PRIMARY_LIGHT),
        ("5", "Commun", "je repère un outil à suivre", OLIVE, "3D4D1F"),
    ]
    centres = [2.0 + i * 2.333 for i in range(5)]  # 2.0 ... 11.33

    add_shape(slide, MSO_SHAPE.RECTANGLE, 1.0, ly - 0.02, W - 2.0, 0.04,
              fill=CHEMIN, line=None)
    dash_col = blend(PRIMARY, CHEMIN, 0.4)  # pointillés terre du SVG (op. 0.3)
    for ca, cb in zip(centres, centres[1:]):
        add_arrow(slide, ca + 0.45, ly, cb - 0.45, ly, color=dash_col,
                  width=1.75, dash=DASH.DASH, head=False)

    r = 0.34
    for (num, titre, sous, c_disque, c_label), cx in zip(jalons, centres):
        disque = add_shape(slide, MSO_SHAPE.OVAL, cx - r, ly - r, 2 * r,
                           2 * r, fill=c_disque, line=TEXT_LIGHT, line_w=2.5)
        shape_text(disque, [num], font=F_TITRE, size=17, bold=True,
                   color=TEXT_LIGHT, margins=0.0)
        add_text(slide, cx - 1.1, ly + 0.52, 2.2, 0.32, [titre],
                 font=F_TITRE, size=12, bold=True, color=c_label,
                 align=PP_ALIGN.CENTER)
        add_text(slide, cx - 1.15, ly + 0.86, 2.3, 0.28, [sous],
                 font=F_CORPS, size=9.5, color=TEXT_MUTED,
                 align=PP_ALIGN.CENTER, wrap=False)


# ---------------------------------------------------------------------------
# Diapo 6 : le village schématique (généré depuis communities.json)
# ---------------------------------------------------------------------------

def build_village(prs):
    slide = new_slide(prs, "Source : src/data/communities.json "
                           "(dépôt e-sol-demo) ; composition inspirée de "
                           "src/components/illustration-village.html. Le "
                           "dessin illustré complet reste publié en PNG "
                           "(src/img/portage/village-esol.png).")
    slide_title(slide, "LE VILLAGE E-SOL",
                "Une maison par communauté ; au centre, les lieux partagés "
                "de la place.")

    with open(os.path.join(REPO, "src", "data", "communities.json"),
              encoding="utf-8") as f:
        communities = {c["id"]: c for c in json.load(f)}

    def house(cid, x, w, roof_y, roof_h, body_h, size):
        c = communities[cid]
        color, bg = c["categoryColor"].lstrip("#"), c["categoryBg"].lstrip("#")
        add_shape(slide, MSO_SHAPE.ISOSCELES_TRIANGLE, x, roof_y, w, roof_h,
                  fill=color, line=None)
        body = add_shape(slide, MSO_SHAPE.RECTANGLE, x + 0.06,
                         roof_y + roof_h, w - 0.12, body_h, fill=bg,
                         line=color, line_w=1.25)
        shape_text(body, [c["shortName"]], font=F_TITRE, size=size,
                   bold=True, color=color, line_spacing=0.95, margins=0.02)

    # Rangée du haut : huit maisons (mêmes que l'arrière-plan du dessin).
    rang1 = ["promosolseduc", "promosolsterrain", "refersols",
             "secteur-prive", "sols-et-art", "afes-comm", "afes-admins",
             "zones-humides"]
    slot = (W - 0.84) / 8
    for i, cid in enumerate(rang1):
        house(cid, 0.42 + i * slot + (slot - 1.42) / 2, 1.42,
              roof_y=1.02, roof_h=0.34, body_h=0.82, size=8.5)

    # Rangée du bas : quatre maisons autour de la place centrale.
    for cid, x in (("fresque-sol", 0.55), ("iprsol", 2.45),
                   ("srp-sols", 9.15), ("zan", 11.02)):
        house(cid, x, 1.76, roof_y=2.55, roof_h=0.40, body_h=1.02, size=9.5)

    # La place : une esplanade et cinq lieux partagés.
    add_shape(slide, MSO_SHAPE.OVAL, 4.38, 2.45, 4.58, 2.85,
              fill=blend(BOIS, BG_BASE, 0.22), line=BOIS, line_w=1.0)
    lieux = [
        ("L'agora", "le forum", 5.86, 2.72, 1.62),
        ("L'atelier", "les communs", 4.60, 3.55, 1.55),
        ("La bibliothèque", "les ressources", 7.02, 3.55, 1.72),
        ("L'accueil", "s'inscrire", 5.12, 4.42, 1.45),
        ("Le panneau", "les annonces", 6.80, 4.42, 1.55),
    ]
    for titre, sous, lx, ly_, lw in lieux:
        card = add_shape(slide, MSO_SHAPE.RECTANGLE, lx, ly_, lw, 0.60,
                         fill=TEXT_LIGHT, line=BOIS, line_w=1.25)
        shape_text(card, [
            [{"t": titre, "size": 9.5, "bold": True, "color": TEXT_MAIN}],
            [{"t": sous, "font": F_CORPS, "size": 8, "color": TEXT_MUTED}],
        ], font=F_TITRE, line_spacing=1.0, margins=0.01)

    # Le sol : la charte, sous tout le village.
    add_shape(slide, MSO_SHAPE.RECTANGLE, 0, 5.55, W, 0.78,
              fill=SOL_VILLAGE, line=None)
    add_text(slide, 1.0, 5.63, W - 2.0, 0.3, ["LE SOL - LA CHARTE E-SOL"],
             font=F_TITRE, size=11.5, bold=True, color=TEXT_LIGHT,
             align=PP_ALIGN.CENTER)
    add_text(slide, 1.0, 5.95, W - 2.0, 0.28,
             ["transparence - biens communs - évolutivité - robustesse - "
              "licences ouvertes CC BY-SA"],
             font=F_CORPS, size=9, color=CHEMIN, align=PP_ALIGN.CENTER)

    # Légende des catégories (carré = fond de façade, bord = couleur du toit).
    est = [(cat, 0.24 + 0.30 + len(cat) * 0.062) for cat in CAT]
    total = sum(w for _c, w in est) + 0.30 * (len(est) - 1)
    lx = (W - total) / 2
    for cat, item_w in est:
        color, bg = CAT[cat]
        add_shape(slide, MSO_SHAPE.RECTANGLE, lx, 6.66, 0.20, 0.20,
                  fill=bg, line=color, line_w=1.5)
        add_text(slide, lx + 0.27, 6.63, item_w - 0.27, 0.26, [cat],
                 font=F_CORPS, size=8.5, color=TEXT_MUTED, wrap=False)
        lx += item_w + 0.30


# ---------------------------------------------------------------------------
# Diapo 7 : légende générale
# ---------------------------------------------------------------------------

def build_legende(prs):
    slide = new_slide(prs, "Source : src/components/head.html "
                           "(tokens CSS du design system e-Sol).")
    slide_title(slide, "LÉGENDE - COULEURS ET CORRESPONDANCES")

    def col_header(x, w, text):
        add_text(slide, x, 0.95, w, 0.34, [text], font=F_TITRE, size=12.5,
                 bold=True, color=TEXT_MAIN)

    # Colonne 1 : la palette de base.
    col_header(0.7, 3.6, "La palette du site")
    palette = [("Terre (primaire)", PRIMARY), ("Terre foncée", PRIMARY_DARK),
               ("Terre claire", PRIMARY_LIGHT), ("Olive", OLIVE),
               ("Bois", BOIS), ("Texte principal", TEXT_MAIN),
               ("Texte atténué", TEXT_MUTED), ("Fond crème", BG_BASE)]
    for i, (nom, hexa) in enumerate(palette):
        y = 1.48 + i * 0.5
        add_shape(slide, MSO_SHAPE.RECTANGLE, 0.7, y, 0.32, 0.32, fill=hexa,
                  line=blend(TEXT_MAIN, BG_BASE, 0.25), line_w=0.75)
        add_text(slide, 1.16, y - 0.02, 3.1, 0.4, [[
            {"t": nom, "font": F_TITRE, "size": 10.5},
            {"t": "   #" + hexa.lower(), "font": F_CORPS, "size": 8.5,
             "color": TEXT_MUTED},
        ]], color=TEXT_MAIN, anchor=MSO_ANCHOR.TOP)

    # Colonne 2 : les cinq niveaux (fond + bordure).
    col_header(4.7, 4.0, "Les cinq niveaux")
    niveaux = ["1 - Visiteur·euse non inscrit·e", "2 - Membre inscrit·e",
               "3 - Membre d'une communauté",
               "4 - Animateur·rice de communauté",
               "5 - Administrateur·rice de la plateforme"]
    for i, (nom, (bg, border, _t, _b)) in enumerate(zip(niveaux, NIVEAUX)):
        y = 1.48 + i * 0.78
        add_shape(slide, MSO_SHAPE.RECTANGLE, 4.7, y, 0.58, 0.44, fill=bg,
                  line=border, line_w=2.0)
        add_text(slide, 5.42, y - 0.04, 3.5, 0.34, [nom], font=F_TITRE,
                 size=10.5, color=TEXT_MAIN)
        add_text(slide, 5.42, y + 0.24, 3.5, 0.26,
                 ["fond #%s, bordure #%s" % (bg.lower(), border.lower())],
                 font=F_CORPS, size=8.5, color=TEXT_MUTED)

    # Colonne 3 : les sept catégories de communautés.
    col_header(9.15, 3.8, "Les catégories de communautés")
    for i, (cat, (color, bg)) in enumerate(CAT.items()):
        y = 1.48 + i * 0.56
        add_shape(slide, MSO_SHAPE.RECTANGLE, 9.15, y, 0.46, 0.34, fill=bg,
                  line=color, line_w=1.75)
        add_text(slide, 9.75, y - 0.04, 3.3, 0.3, [[
            {"t": cat, "font": F_TITRE, "size": 10.5},
        ]], color=TEXT_MAIN)
        add_text(slide, 9.75, y + 0.20, 3.3, 0.24,
                 ["#%s sur #%s" % (color.lower(), bg.lower())],
                 font=F_CORPS, size=8, color=TEXT_MUTED)

    add_text(slide, 0.9, 6.9, W - 1.8, 0.3,
             ["Couleurs reprises des tokens CSS du site "
              "(src/components/head.html). Contenu sous licence CC BY-SA."],
             font=F_CORPS, size=9, color=TEXT_MUTED, align=PP_ALIGN.CENTER)


# ---------------------------------------------------------------------------
# Garde-fous rédactionnels : pas de tiret cadratin ou demi-cadratin, pas de
# point médian hors écriture inclusive, pas de « valider les adhésions ».
# ---------------------------------------------------------------------------

def audit(prs):
    lettre = "A-Za-zÀ-ÖØ-öø-ÿ"
    median_hors_mot = re.compile("(?<![%s])·|·(?![%s])" % (lettre, lettre))
    problemes = []
    for i, slide in enumerate(prs.slides, start=1):
        textes = [sh.text_frame.text for sh in slide.shapes if sh.has_text_frame]
        textes.append(slide.notes_slide.notes_text_frame.text)
        for t in textes:
            if "—" in t or "–" in t:
                problemes.append((i, "tiret cadratin/demi-cadratin", t))
            if median_hors_mot.search(t):
                problemes.append((i, "point médian séparateur", t))
            if "valider les adhésions" in t.lower():
                problemes.append((i, "mention obsolète (adhésion libre)", t))
    if problemes:
        for num, motif, t in problemes:
            print("  diapo %d - %s : %r" % (num, motif, t[:90]))
        raise SystemExit("Audit texte en échec : corriger build-pptx.py")


def main():
    prs = Presentation()
    prs.slide_width = Emu(12192000)   # 13,333 po
    prs.slide_height = Emu(6858000)   # 7,5 po
    prs.core_properties.title = "Schémas e-Sol"
    prs.core_properties.author = "e-Sol / AFES"
    prs.core_properties.comments = ("Généré par scripts/build-pptx.py "
                                    "(dépôt e-sol-demo). CC BY-SA.")

    build_titre(prs)
    build_sentier(prs)
    build_gouvernance(prs)
    build_vue_communaute(prs)
    build_premiers_pas(prs)
    build_village(prs)
    build_legende(prs)

    audit(prs)
    os.makedirs(OUT_DIR, exist_ok=True)
    prs.save(OUT_PPTX)
    print("OK : %s (%d diapositives, %.0f Ko)" % (
        os.path.relpath(OUT_PPTX, REPO), len(prs.slides),
        os.path.getsize(OUT_PPTX) / 1024))


if __name__ == "__main__":
    sys.exit(main())
