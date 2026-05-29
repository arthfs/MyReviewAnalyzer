
from rmp_client import RMPClient
from sqlalchemy import Integer, JSON, create_engine, select, update, insert
from sqlalchemy.orm import sessionmaker, DeclarativeBase, mapped_column, Mapped
from typing import Any, Dict
from dotenv import load_dotenv
import os

load_dotenv()


engine = create_engine(f"mysql+mysqldb://{os.getenv('DB_username')}:{os.getenv('DB_password')}@{os.getenv('DB_host')}/{os.getenv('DB_database')}")


class Base(DeclarativeBase):
    pass

class Professor(Base):
    __tablename__ = 'professor'

    id: Mapped[int] = mapped_column(primary_key = True)
    data: Mapped[Dict[str, Any]] = mapped_column(JSON)

    def __repr__(self):
       return f"Professor(id = {self.id}, data = {self.data})"

class Rmp(Base):
    __tablename__ = 'rmp'
    id: Mapped['int'] = mapped_column(primary_key = True)
    data: Mapped[ Dict[str, Any]] = mapped_column(JSON)

#Base.metadata.create_all(engine)

#newprof = Professor(data = {"first_name":'paul',"last_name":'puio'})
#session.add(newprof)

def refine(prof_data):
    refined_data = {
    'prof_id' : prof_data['id'],
    'name' : prof_data['name'],
    'tags' : prof_data['tags'],
    'department' : prof_data['department'],
    'num_ratings' : prof_data['num_ratings'],
    'overall_rating' : prof_data['overall_rating'],
    'percent_take_again' : prof_data['percent_take_again'],
    'level_of_difficulty' : prof_data['level_of_difficulty'],
    'rating_distribution' : prof_data['rating_distribution'], 
    }

    return refined_data

def get_prof(first_name, last_name):
   
    Session = sessionmaker(bind = engine)
    session = Session()

    
    client = RMPClient()
    stmt = select(Professor).where(Professor.data['first_name'].__eq__(first_name) and Professor.data['last_name'].__eq__(last_name) )
    data = session.scalars(stmt).all()
    
    rmp_professor = client.search_professors(f'{first_name} {last_name}', school_id = 825).professors
    
    if rmp_professor == []:
        #not found on RMP
        print('not found')
        session.close()
        return {}
    
    if len(data) == 0:
        #not in database
        print('here')
        professor = None
        for prof in rmp_professor:
            print(prof)
            fname, lname = prof.name.split()
            fname = fname.lower()
            lname = lname.lower()

            if (fname == first_name and lname == last_name) or (
                fname == last_name and lname == first_name):
                professor = prof
                break 

        if professor == None:
            session.close()
            return "something went wrong"
        
        prof_data = professor.model_dump()
        stored_data = refine(prof_data)
        stored_data['reviews'] = get_rmp_reviews(stored_data['prof_id'])
        stmt = insert(Professor).values(data = stored_data)
        session.execute(stmt)
        session.commit()
        session.close()
        return stored_data

    
    else:
        remote_data = refine(rmp_professor[0])
        remote_data['reviews'] = get_rmp_reviews(remote_data['prof_id'])
        if remote_data == data[0].data:
            #there were no changes in this prof's data
            session.close()
            return data[0]
        
        update_prof(remote_data.id, remote_data)

        session.close()
        return remote_data

def update_prof(prof_id, new_data):
    
    Session = sessionmaker(bind = engine)
    session = Session()

    stmt = update(Professor).where(Professor.data['id'].__eq__ (prof_id).values(data = new_data))
    session.execute(stmt)
    session.close()


test = {"first_name":'navaro',"last_name":'mk'}


def get_rmp_reviews(prof_id):
    client = RMPClient()
    iterator = client.iter_professor_ratings(prof_id)
    remote_result = [ object.model_dump_json() for object in iterator]
    client.close()
    return remote_result
  

#print(get_rmp_reviews('182646')[:5])
'''
    Column('first_name', String(50)),
    Column('lname', String(50)),
    Column('dept' , String(100)), 
    Column('school', String(100)),
    Column('rating' , Float(1)), 
    Column('difficulty', Float(1)), 
    Column('num_rating' , Integer),
    Column('take_again' , Float(2)), 
    Column('id', String(10), primary_key = True) ,

'''

'''
rmp = Table(
    'rmp',
    metadata_obj,
    Column('prof_id', ForeignKey("professor.id", ondelete = 'cascade', onupdate = 'cascade')),
    Column('review', JSON)
    )
'''
