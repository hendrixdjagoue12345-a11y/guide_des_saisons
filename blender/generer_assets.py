"""Construit les éléments du Gardien des saisons avec Blender 4.3."""
from pathlib import Path
from math import sin, cos, tau
from mathutils import Vector
import bpy
import random

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT
(OUT / 'assets').mkdir(parents=True, exist_ok=True)
(OUT / 'blender').mkdir(parents=True, exist_ok=True)
rng = random.Random(42)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)


def material(name, color, emission=0, metallic=0):
    result = bpy.data.materials.new(name)
    linear = tuple(v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in color)
    result.diffuse_color = (*linear, 1)
    result.use_nodes = True
    shader = result.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*linear, 1)
    shader.inputs['Roughness'].default_value = .83
    shader.inputs['Metallic'].default_value = metallic
    shader.inputs['Emission Color'].default_value = (*linear, 1)
    shader.inputs['Emission Strength'].default_value = emission
    return result


mats = {
    'Ground': material('Ground', (.65, .61, .24)),
    'Grass': material('Grass', (.47, .53, .28)),
    'Bark': material('Bark', (.30, .105, .037)),
    'Stone': material('Stone', (.31, .30, .38)),
    'Crystal': material('Crystal', (.07, .70, .78), .65, .2),
    'Snow': material('Snow', (.85, .94, 1.0)),
}
for i, color in enumerate([(.95,.36,.21),(.96,.68,.24),(.52,.24,.44),(.83,.27,.22),(.94,.79,.33)]):
    mats[f'Leaf_{i}'] = material(f'Leaf_{i}', color)
rock_mats = [material(f'Rock_{i}', color) for i, color in enumerate([
    (.22,.19,.32),(.31,.24,.37),(.25,.24,.38),(.37,.28,.31),(.25,.29,.40)
])]


def group(name):
    result = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(result)
    return result


def finish(obj, name, mat, parent):
    obj.name = name
    if mat: obj.data.materials.append(mat)
    obj.parent = parent
    return obj


def mesh(name, vertices, faces, mat, parent):
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    return finish(obj, name, mat, parent)


def ico(name, loc, scale, mat, parent, detail=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=detail, radius=1, location=loc)
    obj = bpy.context.object
    obj.scale = scale
    obj.rotation_euler = (rng.random()*.5, rng.random()*.5, rng.random()*tau)
    return finish(obj, name, mat, parent)


def box(name, loc, size, mat, parent, bevel=.06):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = obj.modifiers.new('Arêtes adoucies', 'BEVEL')
    mod.width = bevel
    mod.segments = 1
    obj.modifiers.new('Normales', 'WEIGHTED_NORMAL')
    return finish(obj, name, mat, parent)


def branch(name, points, radii, parent):
    vertices = []
    for index, (point, radius) in enumerate(zip(points, radii)):
        for j in range(9):
            a = j*tau/9 + index*.17
            vertices.append((point[0]+cos(a)*radius,point[1]+sin(a)*radius,point[2]))
    faces = []
    for index in range(len(points)-1):
        for j in range(9):
            a=index*9+j; b=index*9+(j+1)%9
            faces.append((a,b,b+9,a+9))
    faces.extend([tuple(reversed(range(9))),tuple(range(len(vertices)-9,len(vertices)))])
    return mesh(name, vertices, faces, mats['Bark'], parent)


island = group('Island')
vertices=[]
segments=18
for level,(radius,height) in enumerate([(4.1,0),(3.55,-.85),(2.55,-1.65),(1.05,-2.75),(.10,-3.32)]):
    for j in range(segments):
        a=j*tau/segments
        r=radius*(.90+rng.random()*.19)
        vertices.append((cos(a)*r,sin(a)*r*.77,height+(rng.random()-.5)*.25))
faces=[]
for level in range(4):
    for j in range(segments):
        a=level*segments+j; b=level*segments+(j+1)%segments
        faces.extend([(a,a+segments,b),(b,a+segments,b+segments)])
body=mesh('Island_Rock',vertices,faces,None,island)
for mat in rock_mats:body.data.materials.append(mat)
for poly in body.data.polygons:poly.material_index=rng.randrange(len(rock_mats))
# The surface shares the border of the island and is built from triangles.
top=list(vertices[:segments])+[(0,0,.025)]
mesh('Island_Ground',top,[(segments,j,(j+1)%segments) for j in range(segments)],mats['Ground'],island)


tree = group('Tree')
branch('Tree_Trunk',[(0,.25,0),(-.38,.32,.9),(.05,.3,1.85),(-.28,.3,2.75),(.08,.38,3.75),(.1,.35,4.75)],[.59,.49,.42,.33,.23,.08],tree)
branches=[
    ([(-.1,.3,1.8),(-1.1,.24,2.4),(-1.8,.20,3.05)],[.28,.20,.08]),
    ([(-.2,.3,2.7),(.85,.26,3.15),(1.75,.20,3.85)],[.26,.17,.05]),
    ([(0,.3,3.4),(-1.0,.6,4.0),(-1.5,.7,4.7)],[.23,.14,.04]),
    ([(-.1,.3,2.6),(.3,1.2,3.4),(.65,1.65,4.35)],[.23,.15,.04]),
    ([(0,.3,3.9),(.1,-.5,4.5),(.12,-.9,4.95)],[.19,.11,.035]),
]
for i,(points,radii) in enumerate(branches):branch(f'Tree_Branch_{i:02}',points,radii,tree)
for i in range(6):
    a=i*tau/6
    branch(f'Tree_Root_{i:02}',[(cos(a)*1.04,.25+sin(a)*.9,.02),(cos(a)*.45,.25+sin(a)*.4,.22),(0,.25,.63)],[.06,.17,.22],tree)
clusters=[
    ((.0,.35,5.1),(1.33,1.04,1.0),0),
    ((-1.3,.7,4.65),(1.18,.92,.82),2),
    ((1.5,.45,4.35),(1.12,.85,.87),4),
    ((-1.85,.10,3.43),(1.06,.86,.76),1),
    ((-.92,-.45,3.92),(1.17,.89,.81),0),
    ((1.15,-.20,3.43),(1.05,.84,.73),1),
    ((.3,1.55,4.4),(1.12,.90,.85),3),
    ((1.96,.91,3.40),(.86,.74,.64),2),
    ((-1.55,1.21,3.62),(.93,.78,.73),2),
]
snow=group('Snow')
for i,(loc,size,color) in enumerate(clusters):
    ico(f'Tree_Leaves_{i:02}',loc,size,mats[f'Leaf_{color}'],tree,2)
    cap=(loc[0],loc[1],loc[2]+size[2]*.69)
    ico(f'Snow_Canopy_{i:02}',cap,(size[0]*.79,size[1]*.79,size[2]*.30),mats['Snow'],snow,2)
for i in range(5):
    x,y=[(-2,-1.2),(1.4,-2.0),(2.9,.8),(-2.7,.6),(.1,-1.25)][i]
    ico(f'Snow_Ground_{i}',(x,y,.10),(.70,.45,.06),mats['Snow'],snow,2)


shrine=group('Shrine')
box('Shrine_Base',(2.05,-1.10,.16),(1.55,1.07,.25),mats['Stone'],shrine,.07)
for i,x in enumerate([1.5,2.6]):
    box(f'Shrine_Pillar_{i}',(x,-.95,.86),(.30,.38,1.26),mats['Stone'],shrine,.075)
box('Shrine_Lintel',(2.05,-.95,1.57),(1.55,.55,.33),mats['Stone'],shrine,.10)
box('Shrine_Step',(2.05,-1.68,.085),(.95,.35,.15),mats['Stone'],shrine,.04)
crystals=group('Crystals')
for i,(x,y,size) in enumerate([(2.04,-1.18,.70),(1.72,-1.35,.43),(2.36,-1.28,.40)]):
    bpy.ops.mesh.primitive_cone_add(vertices=5,radius1=.15,radius2=.075,depth=size,location=(x,y,.30+size/2))
    obj=finish(bpy.context.object,f'Crystal_Shaft_{i}',mats['Crystal'],crystals)
    bpy.ops.mesh.primitive_cone_add(vertices=5,radius1=.075,radius2=0,depth=size*.34,location=(x,y,.30+size*1.17))
    finish(bpy.context.object,f'Crystal_Tip_{i}',mats['Crystal'],crystals)


props=group('Props')
for i,(x,y,z,size) in enumerate([(-2.55,-.9,.32,(.60,.53,.65)),(-.75,-2.0,.18,(.54,.45,.40)),(3.0,-1.38,.15,(.48,.42,.33))]):
    ico(f'Rock_{i}',(x,y,z),size,mats['Stone'],props,1)
for i in range(19):
    a=rng.random()*tau;r=rng.uniform(1.0,3.5)
    x,y=cos(a)*r,sin(a)*r*.72
    if 1.0<x<3 and -1.9<y<-.45:continue
    verts=[];faces=[]
    for j in range(5):
        ang=j*tau/5
        base=len(verts)
        verts.extend([(x-.055*cos(ang),y-.055*sin(ang),.03),(x+.055*cos(ang),y+.055*sin(ang),.03),(x+cos(ang)*.20,y+sin(ang)*.20,rng.uniform(.24,.46))])
        faces.append((base,base+1,base+2))
    mesh(f'Grass_{i:02}',verts,faces,mats['Grass'],props)


leaf=group('Leaf_Template')
leaf_obj=mesh('Leaf',[(0,0,0),(.15,0,.10),(.40,0,0),(.15,0,-.10)],[(0,1,2),(0,2,3)],mats['Leaf_1'],leaf)
leaf.hide_render=True


def descendants(parent):
    return [parent]+list(parent.children_recursive)


def export(name, groups):
    bpy.ops.object.select_all(action='DESELECT')
    for parent in groups:
        for obj in descendants(parent):obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/'assets'/name),export_format='GLB',use_selection=True,export_apply=True)


all_groups=[island,tree,shrine,crystals,props,snow]
export('gardien.glb',all_groups)
for filename,groups in [('ile.glb',[island]),('arbre.glb',[tree,snow]),('sanctuaire.glb',[shrine,crystals]),('decors.glb',[props]),('feuille.glb',[leaf])]:
    export(filename,groups)
for obj in descendants(snow):obj.hide_set(True);obj.hide_render=True
for obj in descendants(leaf):obj.hide_set(True);obj.hide_render=True

scene=bpy.context.scene
scene.world.color=(.18,.18,.23)


def aim(obj,target):
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()


def area(name,loc,power,color,size):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.color=color;data.shape='DISK';data.size=size
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=loc;aim(obj,(0,0,1))


area('Key',(-4,-6,9),1100,(1,.72,.46),6)
area('Fill',(5,-2,5),550,(.42,.64,1),7)
area('Rim',(0,5,8),950,(.77,.58,1),5)
bpy.ops.object.camera_add(location=(9,-16,8))
cam=bpy.context.object;cam.name='Camera_Presentation';cam.data.type='ORTHO';cam.data.ortho_scale=11.8;aim(cam,(0,0,.85));scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=False
scene.render.resolution_x=1440;scene.render.resolution_y=1440;scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.render.filepath=str(OUT/'assets'/'apercu.png')
# Save both the full scene and the source collections for direct editing.
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'blender'/'Gardien_des_saisons.blend'))
for filename,groups in [('Ile.blend',[island]),('Arbre.blend',[tree,snow]),('Sanctuaire.blend',[shrine,crystals]),('Decors.blend',[props]),('Feuille.blend',[leaf])]:
    asset_scene = bpy.data.scenes.new(filename.removesuffix('.blend'))
    for parent in groups:
        for obj in descendants(parent): asset_scene.collection.objects.link(obj)
    asset_scene.world = scene.world
    bpy.data.libraries.write(str(OUT/'blender'/filename), {asset_scene})
    bpy.data.scenes.remove(asset_scene)
bpy.ops.render.render(write_still=True)
print('ASSETS_READY')
